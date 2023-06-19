import { test } from "uvu"
import { equal } from "uvu/assert"
import { getRepoUrl } from "./main"

test("repo-url", () => {
  const t = (url: string, exp: string | null) => {
    return equal(getRepoUrl(url), exp, `FAIL: ${url} -> ${exp}`)
  }

  t("git@github.com:user/repo", "git@github.com:user/repo")
  t("http://github.com/user/repo", "http://github.com/user/repo")
  t("https://github.com/user/repo", "https://github.com/user/repo")

  t("github:user/repo", "https://github.com/user/repo")
  t("user/repo", "https://github.com/user/repo")

  t("user/repo#main", "https://github.com/user/repo#main")
  t("user/repo#v1.2", "https://github.com/user/repo#v1.2")
  t("user/repo#abc123", "https://github.com/user/repo#abc123")

  t("gitlab:user/repo", "https://gitlab.org/user/repo")
  t("git@gitlab.org:user/repo", "git@gitlab.org:user/repo")
  t("https://gitlab.org/user/repo", "https://gitlab.org/user/repo")

  t("gitlab:user/repo#v2", "https://gitlab.org/user/repo#v2")
  t("git@gitlab.org:user/repo#v2", "git@gitlab.org:user/repo#v2")
  t("https://gitlab.org/user/repo#v2", "https://gitlab.org/user/repo#v2")
})

test.run()
