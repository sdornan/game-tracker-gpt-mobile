export const getGameImageUrl = (imageId: string, imageSize = 'cover_small') =>
  `https://images.igdb.com/igdb/image/upload/t_${imageSize}_2x/${imageId}.png`

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
