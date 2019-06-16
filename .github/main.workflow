workflow "Build, and Test on push" {
  on = "push"
  resolves = [
    "Send Push Notification",
    "Build Blog",
    "Cypress E2E Tests"
  ]
}

action "Clean Install" {
  uses = "actions/npm@master"
  args = "ci"
}

action "Build Blog" {
  uses = "actions/npm@master"
  needs = ["Clean Install"]
  args = "run build"
}

action "Cypress E2E Tests" {
  uses = "bartlett705/npm-cy@master"
  needs = ["Clean Install"]
  args = "test"
}

action "Send Push Notification" {
  uses = "techulus/push-github-action@master"
  secrets = ["API_KEY"]
  needs = ["Build Blog"]
  env = {
    MESSAGE = "https://lacourt.dev/ updated by Github Actions pipeline!"
  }
}
