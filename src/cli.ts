import { templl } from "./main"

const run = async () => {
  try {
    await templl()
    process.exit(0)
  } catch (e) {
    if (e instanceof Error) console.error(e.message)
    process.exit(1)
  }
}

run()
