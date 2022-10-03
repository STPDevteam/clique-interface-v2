import { BytesLike, keccak256 } from 'ethers/lib/utils'
import { MerkleTree } from 'merkletreejs'

export function getMerkleTreeRootHash(whitelistAddresses: BytesLike[]): string {
  const leafNodes = whitelistAddresses.map(addr => keccak256(addr))
  const merkleTree = new MerkleTree(leafNodes, keccak256)
  return merkleTree.getHexRoot()
}

export function getMerkleTreeHexProof(whitelistAddresses: BytesLike[], addresses: BytesLike): string[] {
  const leafNodes = whitelistAddresses.map(addr => keccak256(addr))
  const merkleTree = new MerkleTree(leafNodes, keccak256)
  const claimingAddress = keccak256(addresses)
  const hexProof = merkleTree.getHexProof(claimingAddress)
  return hexProof
}
