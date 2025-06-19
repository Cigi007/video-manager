import Page from '../models/Page.js';
import Video from '../models/Video.js';

export const getPages = async (req, res) => {
  try {
    const pages = await Page.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: {
        model: Video,
        as: 'Videos',
        through: { attributes: [] },
        attributes: ['id', 'title', 'thumbnail'],
      },
    });
    res.json(pages);
  } catch (error) {
    console.error('Chyba při načítání stránek:', error);
    res.status(500).json({ error: 'Chyba při načítání stránek.', detail: error.message });
  }
};

export const createPage = async (req, res) => {
  try {
    console.log('Backend - createPage received body:', req.body);
    const { name, url } = req.body;
    const userId = req.user.id;

    if (!name || !url) {
      console.error('Chyba: Název nebo URL stránky chybí.', { name, url });
      return res.status(400).json({ error: 'Název a URL jsou povinné.' });
    }

    const existingPage = await Page.findOne({ where: { userId, url } });
    if (existingPage) {
      console.error(`Chyba: Stránka s URL ${url} již pro uživatele ${userId} existuje.`);
      return res.status(409).json({ error: 'Stránka s touto URL pro vašeho uživatele již existuje.' });
    }

    const page = await Page.create({
      userId,
      name,
      url,
    });
    res.status(201).json(page);
  } catch (error) {
    console.error('Chyba při vytváření stránky:', error.message, error.stack);
    res.status(500).json({ error: 'Chyba při vytváření stránky.', detail: error.message });
  }
};

export const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url, abTesting, connectedVideoIds } = req.body;
    const page = await Page.findOne({ where: { id, userId: req.user.id } });
    if (!page) return res.status(404).json({ error: 'Stránka nenalezena.' });

    if (name !== undefined) page.name = name;
    if (url !== undefined) page.url = url;
    if (abTesting !== undefined) page.abTesting = abTesting;

    if (connectedVideoIds !== undefined && Array.isArray(connectedVideoIds)) {
      const videos = await Video.findAll({ where: { id: connectedVideoIds, userId: req.user.id } });
      await page.setVideos(videos);
    }

    await page.save();
    
    const updatedPage = await Page.findByPk(id, {
      include: {
        model: Video,
        as: 'Videos',
        through: { attributes: [] },
        attributes: ['id', 'title', 'thumbnail'],
      },
    });
    
    res.json(updatedPage);
  } catch (error) {
    console.error('Chyba při aktualizaci stránky:', error);
    res.status(500).json({ error: 'Chyba při aktualizaci stránky.', detail: error.message });
  }
};

export const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const page = await Page.findOne({ where: { id, userId } });
    if (!page) {
      return res.status(404).json({ error: 'Stránka nenalezena.' });
    }

    await page.destroy();
    res.json({ success: true, message: 'Stránka byla úspěšně smazána.' });
  } catch (error) {
    console.error('Chyba při mazání stránky:', error);
    res.status(500).json({ error: 'Chyba při mazání stránky.', detail: error.message });
  }
}; 