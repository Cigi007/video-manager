// Mock data for pages and videos, shared across the app

export const mockPages = [
  {
    id: 1,
    name: 'Home Page',
    url: 'www.brunoshop.cz/',
    videos: [
      {
        id: 1,
        name: 'Vítací video',
        thumbnail: 'https://randomuser.me/api/portraits/women/44.jpg',
        modified: 'an hour ago',
      },
    ],
    abTesting: 'Inactive',
  },
];

export const mockAllVideos = [
  {
    id: 1,
    name: 'Vítací video',
    thumbnail: 'https://randomuser.me/api/portraits/women/44.jpg',
    modified: 'an hour ago',
  },
  {
    id: 2,
    name: 'Produktové video',
    thumbnail: 'https://randomuser.me/api/portraits/men/32.jpg',
    modified: '2 days ago',
  },
]; 