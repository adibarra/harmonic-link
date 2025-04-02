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

type ChainItem = Artist | Album

