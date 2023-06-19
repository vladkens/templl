import { exec as execSync } from "node:child_process"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

const exec = promisify(execSync)
const isMain = import.meta.url && fileURLToPath(import.meta.url) === process.argv[1]

export const getRepoUrl = (repo: string) => {
  if (repo.startsWith("git@")) return repo
  if (repo.startsWith("https://") || repo.startsWith("http://")) return repo
  if (repo.startsWith("github:")) return repo.replace(/^github:/, "https://github.com/")
  if (repo.startsWith("gitlab:")) return repo.replace(/^gitlab:/, "https://gitlab.org/")

  const parts = repo.split("/")
  if (parts.length === 2) return `https://github.com/${parts[0]}/${parts[1]}`

  throw new Error(`Invalid repo url: ${repo}`)
}

export const main = async () => {
  const args = process.argv.slice(2)
  if (args.length !== 2) {
    console.error(`Usage: templl <src> <dst>`)
    process.exit(1)
  }

  const [src, dst = "."] = args
  const repo = getRepoUrl(src)

  await exec(`git clone --depth 1 ${repo} ${dst}`)
  await exec(`rm -rf ${resolve(dst, ".git")}`)
  await exec(`cd ${dst} && git init`)
}

const run = async () => {
  try {
    await main()
  } catch (e) {
    if (e instanceof Error) console.error(e.message)
    process.exit(1)
  }
}

if (isMain) run()
