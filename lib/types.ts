interface Artist {
  id: string
  name: string
  image: string
}

interface Album {
  id: string
  name: string
  artist: string
  image: string
}

type ChainItem = Artist | Album

