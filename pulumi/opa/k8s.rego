package kubernetes

name = input.metadata.name

labels {
    input.metadata.labels["pulumi"]
}

deny[msg] {
  input.kind = "Deployment"
  not labels
  msg = sprintf("%s must include recommended label: pulumi ", [name])
}
