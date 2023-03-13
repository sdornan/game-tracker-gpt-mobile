export const getGameImageUrl = (imageId: string, imageSize = 'cover_small') =>
  `https://images.igdb.com/igdb/image/upload/t_${imageSize}_2x/${imageId}.png`
