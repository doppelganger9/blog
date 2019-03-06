workflow "Build and deploy on push" {
  on = "push"
  resolves = [
    "techulus/push-github-action@master",
    "Gatsby Build",
    "Deploy to Github Pages",
  ]
}

action "Clean Install" {
  uses = "actions/npm@master"
  args = "ci"
}

action "Prettier Check" {
  uses = "actions/npm@master"
  args = "run format -- --check"
  needs = ["Clean Install"]
}

action "Only Master Branch" {
  uses = "actions/bin/filter@master"
  needs = ["Prettier Check"]
  args = "branch master"
}

action "techulus/push-github-action@master" {
  uses = "techulus/push-github-action@master"
  needs = ["Deploy to Github Pages"]
  secrets = ["API_KEY"]
  env = {
    MESSAGE = "https://blog.lacourt.dev/ updated by Github Actions pipeline!"
  }
}

action "Gatsby Build" {
  uses = "actions/npm@master"
  needs = ["Only Master Branch"]
  args = "run build"
}

action "Deploy to Github Pages" {
  uses = "maxheld83/ghpages@master"
  needs = ["Gatsby Build"]
  secrets = ["GH_PAT"]
  env = {
    BUILD_DIR = "public"
  }
}
