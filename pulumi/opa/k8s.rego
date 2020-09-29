package kubernetes.validating.images

deny[msg] {
	some i
	input.kind == "Deployment"
    image := input.spec.template.spec.containers[i].image
    not startswith(image, "docker.repo.schwarz/")
	msg := sprintf("Image '%v' comes from untrusted registry", [image])
}
