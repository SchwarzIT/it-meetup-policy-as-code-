import * as os from "@pulumi/openstack";
import {PolicyPack, EnforcementLevel, ResourceValidationPolicy, validateResourceOfType} from "@pulumi/policy";

let flavors: Array<string> = ['c1.1', 'c1.2', 'c1.3', 'c1.4', 'c1.5'];

const policies = new PolicyPack("openstack-policy-pack", {
    policies: [
        noUpperCaseInstanceName("mandatory"),
        limitFlavors("mandatory"),
        checkZeroAddress("advisory")
    ],
});

function noUpperCaseInstanceName(enforcementLevel: EnforcementLevel): ResourceValidationPolicy {
    return {
        name: "no-uppercase-instance-name",
        description: "Check if the name of a instance is lowercase",
        enforcementLevel: enforcementLevel,
        validateResource: validateResourceOfType(os.compute.Instance, (instance, _, reportViolation) => {
            if (instance.name != instance.name?.toLowerCase()) {
                reportViolation("Only lowercase instance names are allowed! Change " + instance.name + " to " + instance.name?.toLowerCase());
            }
        }),
    };
}

function limitFlavors(enforcementLevel: EnforcementLevel): ResourceValidationPolicy {
    return {
        name: "limit-flavors",
        description: "Check if selected flavor is allowed",
        enforcementLevel: enforcementLevel,
        validateResource: validateResourceOfType(os.compute.Instance, (instance, _, reportViolation) => {
            if (!flavors.includes(instance.flavorName!)) {
                reportViolation("You are not allowed to use such flavor: " + instance.flavorName +
                    " only " + flavors + " are allowed");
            }
        }),
    };
}

function checkZeroAddress(enforcementLevel: EnforcementLevel): ResourceValidationPolicy {
    return {
        name: "check-zero-address",
        description: "Check if the zero-address 0.0.0.0/0 in CIDR notation is set",
        enforcementLevel: enforcementLevel,
        validateResource: validateResourceOfType(os.networking.SecGroupRule, (secGroupRule, _, reportViolation) => {
            if (secGroupRule.remoteIpPrefix === "0.0.0.0/0") {
                reportViolation("Try to avoid to allow all inbound IPv4 traffic");
            }
        }),
    };
}
