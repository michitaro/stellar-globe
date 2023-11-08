import { gzip } from '@stellar-globe/stellar-globe'


export function serialize(obj: any) {
  return makeBase64UrlSafe(
    encodeArrayToBase64(
      gzip.zip(
        JSON.stringify(obj)
      )
    )
  )
}


export function deserialize(serializedString: string): any {
  const regularBase64 = convertUrlSafeBase64ToRegular(serializedString)
  const binaryString = atob(regularBase64)
  const binaryArray = binaryString.split('').map(char => char.charCodeAt(0))
  const decompressed = gzip.unzip(binaryArray)
  return JSON.parse(String.fromCharCode(...decompressed))
}


function encodeArrayToBase64(array: number[]): string {
  const stringFromIntArray = String.fromCharCode(...array)
  return btoa(stringFromIntArray)
}

function makeBase64UrlSafe(base64String: string): string {
  return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function convertUrlSafeBase64ToRegular(base64UrlSafeString: string): string {
  const regularBase64 = base64UrlSafeString.replace(/-/g, '+').replace(/_/g, '/')
  const padding = (4 - regularBase64.length % 4) % 4
  return regularBase64.padEnd(regularBase64.length + padding, '=')
}
