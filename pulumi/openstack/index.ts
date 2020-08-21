import * as pulumi from "@pulumi/pulumi";
import * as os from "@pulumi/openstack";

const pacnetwork = new os.networking.Network("pac-network", {
    name: "pac-network",
    adminStateUp: true
})

const subnet = new os.networking.Subnet("pac-subnet", {
    name: "pac-subnet",
    networkId: pacnetwork.id,
    cidr: "192.168.10.0/24",
    ipVersion: 4,
    dnsNameservers: [
        "8.8.8.8",
        "8.8.4.4"
    ]
})

const secgrp = new os.networking.SecGroup("pac-sec", {
    name: "pac-sec"
})

const secrule = new os.networking.SecGroupRule("pac22", {
    direction: "ingress",
    ethertype: "IPv4",
    protocol: "tcp",
    portRangeMax: 22,
    portRangeMin: 22,
    remoteIpPrefix: "0.0.0.0/0",
    securityGroupId: secgrp.id
})

// Create an OpenStack resource (Compute Instance)
const instance = new os.compute.Instance("test", {
    flavorName: "c1.2",
    imageName: "Ubuntu_18.04",
    networks: [
        {
            name: pacnetwork.name
        }
    ],
    securityGroups: [
        "default",
        secgrp.name
    ]


});
