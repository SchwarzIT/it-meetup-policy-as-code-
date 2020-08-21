import * as k8s from "@pulumi/kubernetes";
import * as kx from "@pulumi/kubernetesx";

const podinfo = new k8s.kustomize.Directory("podinfo", {
    directory: "https://github.com/stefanprodan/podinfo/kustomize"
});
