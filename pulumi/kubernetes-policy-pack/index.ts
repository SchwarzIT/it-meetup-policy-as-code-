import * as k8s from "@pulumi/kubernetes";
import {PolicyPack, EnforcementLevel, ResourceValidationPolicy, validateResourceOfType} from "@pulumi/policy";


const policies = new PolicyPack("kubernetes-policy-pack", {
    policies: [
        noPulumiLabelSet("mandatory"),
    ],
});

function noPulumiLabelSet(enforcementLevel: EnforcementLevel): ResourceValidationPolicy {
    return {
        name: "no-pulumi-label-set",
        description: "Check if the pulumi label is set to Deployment resource",
        enforcementLevel: enforcementLevel,
        validateResource: validateResourceOfType(k8s.apps.v1.Deployment, (deployment, _, reportViolation) => {
            if (!deployment.metadata?.labels?.pulumi) {
                reportViolation("pulumi label not set");
            }
        }),
    };
}
