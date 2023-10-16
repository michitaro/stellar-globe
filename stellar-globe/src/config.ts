const ssl = location.protocol === 'https:'
const externalProtocol = ssl ? 'https' : 'http'


function defaultConfig() {
  return {
    retina: false,
    decodeImageInBackgroundThread: false,
    tileRenderer: {
      enableMagFilter: true,
    },
    dataRepository: `${externalProtocol}://hscmap.mtk.nao.ac.jp/stellar-globe/static`,
  }
}

export const config = defaultConfig()
