import { artifacts, ethers, upgrades } from 'hardhat'
import jetpack from 'fs-jetpack'
import { BaseContract, Signer } from 'ethers'
import { DeployContractOptions } from '@nomicfoundation/hardhat-ethers/types'
import { DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/dist/utils'
import sleep from "sleep-promise";

export async function deploy(
  contractName: string,
  args: any[],
  signerOrOptions?: Signer | DeployContractOptions,
) {
  const [deployer] = await ethers.getSigners()
  //---
  const contract = await ethers.deployContract(
    contractName,
    args,
    signerOrOptions,
  )
  await sleep(3000);

  console.log(`Deploy ${contractName} address ${await contract.getAddress()} `)

  await saveFrontendFiles(contract, contractName)
  return contract
}

export const deployProxy = async (contractName: string, args?: unknown[], opts?: DeployProxyOptions) => {
  const [deployer] = await ethers.getSigners()
  const contractFactory = await ethers.getContractFactory(contractName)
  const contract = await upgrades.deployProxy(contractFactory, args, opts)

  console.log(`Deploy ${contractName} address ${await contract.getAddress()} `)

  await saveFrontendFiles(contract, contractName)

  return contract
}

export async function upgradeProxy(contractName: string, address: string) {
  const [deployer] = await ethers.getSigners()
  const contractFactory = await ethers.getContractFactory(contractName)

  // const contract = await upgrades.forceImport(address, contractFactory)
  const contract = await upgrades.upgradeProxy(address, contractFactory)
  await saveFrontendFiles(contract, contractName)

  console.log(`Upgrade ${contractName} address ${await contract.getAddress()} `)
  return contract
}

export async function saveFrontendFiles(
  contract: BaseContract,
  contractName: string,
) {
  const contractsDir = __dirname + '/../cache/' + contractName

  jetpack.write(
    contractsDir + '/address.json',
    JSON.stringify(
      {
        contract: contractName,
        address: await contract.getAddress(),
      },
      null,
      2,
    ),
  )

  const tokenArtifact = artifacts.readArtifactSync(contractName)
  jetpack.write(
    contractsDir + '/artifact.json',
    JSON.stringify(tokenArtifact, null, 2),
  )
  jetpack.write(
    contractsDir + '/' + contractName + '.json',
    JSON.stringify(tokenArtifact.abi, null, 2),
  )
}
