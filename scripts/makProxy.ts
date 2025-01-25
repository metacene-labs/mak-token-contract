import { deployProxy, upgradeProxy } from './utils.ts'

async function main() {
  const mak = await deployProxy('MakToken', ["MetaCene", "MAK"])
  console.log(`MakToken deployed to: ${await mak.getAddress()}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
