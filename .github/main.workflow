workflow "Build and deploy on push" {
  on = "push"
  resolves = [
    "Send Push Notification",
    "Build Blog",
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

action "Send Push Notification" {
  uses = "techulus/push-github-action@master"
  secrets = ["API_KEY"]
  needs = ["Build Blog"]
  env = {
    MESSAGE = "https://blog.lacourt.dev/ updated by Github Actions pipeline!"
  }
}
