workflow "Build and deploy on push" {
  on = "push"
  resolves = [
    "Send Push Notification",
    "Gatsby Build",
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

action "Gatsby Build" {
  uses = "actions/npm@master"
  needs = ["Prettier Check"]
  args = "run build"
}

action "Send Push Notification" {
  uses = "techulus/push-github-action@master"
  secrets = ["API_KEY"]
  needs = ["Gatsby Build"]
  env = {
    MESSAGE = "https://blog.lacourt.dev/ updated by Github Actions pipeline!"
  }
}
