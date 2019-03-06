workflow "Build and deploy on push" {
  on = "push"
  resolves = [
    "Only Master Branch",
    "techulus/push-github-action@master",
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

action "Deploy to Github Pages" {
  uses = "actions/npm@master"
  needs = ["Only Master Branch"]
  args = "run deploy"
  env = {
    GIT_AUTHOR_NAME = "Github Action"
    GIT_COMMITTER_NAME = "Github Action"
    GIT_AUTHOR_EMAIL = "david.lacourt@gmail.com"
    GIT_COMMITTER_EMAIL = "david.lacourt@gmail.com"
  }
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
