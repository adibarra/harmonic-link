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

interface StartEnd {
  id1: string
  id2: string
  par: number
}

interface User {
  id: string
  name: string
  image: string
  isGuest: boolean
}

interface Genre {
  name: string
}

type ChainItem = Artist | Album

