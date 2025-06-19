import { expressjwt as jwt } from 'express-jwt';
import jwks from 'jwks-rsa';
import User from '../models/User.js';

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-1mrqpn0f27g3by3r.us.auth0.com/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER_BASE_URL,
  algorithms: ['RS256']
});

export const auth = async (req, res, next) => {
  jwtCheck(req, res, async (err) => {
    if (err) {
      console.error("Auth0 JWT validation error:", err);
      return res.status(401).json({ error: 'Unauthorized', detail: err.message });
    }
    
    // express-jwt ukládá dekódovaný token do req.auth, ne req.user
    if (!req.auth || !req.auth.sub) {
      console.error("Auth0 token missing or invalid sub claim:", req.auth);
      return res.status(401).json({ error: 'Unauthorized: Missing token sub' });
    }
    console.log("Auth0 req.auth.sub:", req.auth.sub);

    // Přidáme informace o uživateli z Auth0 tokenu do req.user
    req.user = {
      id: req.auth.sub,
      email: req.auth.email // Použít req.auth.email
    };

    // Zkontroluj, zda uživatel existuje v naší DB, pokud ne, vytvoř ho
    try {
      console.log(`Searching for user with ID: ${req.user.id}`);
      const [user, created] = await User.findOrCreate({
        where: { id: req.user.id },
        defaults: {
          email: req.auth.email || null, // Email může být z Auth0
          firstName: req.auth.given_name || null, // Příklad: z claimů Auth0
          lastName: req.auth.family_name || null, // Příklad: z claimů Auth0
          // Role bude mít výchozí hodnotu 'user'
          // Heslo nebude pro Auth0 uživatele
        },
      });
      console.log(`User ${created ? 'created' : 'found'}: ${user.id}`);

      // Pokud uživatel existuje, můžeme zvážit aktualizaci jeho údajů zde
      // req.user by již měl obsahovat data z Auth0 tokenu

    } catch (dbError) {
      console.error("Chyba při správě uživatele v DB po Auth0 autentizaci:", dbError);
      return res.status(500).json({ error: "Chyba interního serveru při správě uživatele.", detail: dbError.message });
    }

    next();
  });
};

export const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Přístup odepřen.' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ error: 'Prosím přihlaste se.' });
  }
}; 