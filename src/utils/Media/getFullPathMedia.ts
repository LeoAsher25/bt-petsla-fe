export default function getFullPathMedia(path?: string) {
  if (!path) {
    return null;
  }

  const baseImgUrl = process.env.REACT_APP_BASE_IMG_URL;
  if (baseImgUrl?.endsWith("/") && path.startsWith("/"))
    return baseImgUrl.slice(0, -1) + path;
  else if (!baseImgUrl?.endsWith("/") && !path.startsWith("/"))
    return baseImgUrl + "/" + path;
  return baseImgUrl + path;
}
