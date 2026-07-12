---
title: "Building a Kernel Lab, Then a Plan to Use It"
date: 2026-07-12
description: "Finishing a stalled Debian upgrade, standing up KVM, and a 1-second kernel test harness — then a 90-day path toward my first patch."
tags: ["linux", "kernel", "debian", "qemu", "kvm", "learning", "notes"]
---

I've wanted to contribute to the Linux kernel for a while. The gap was never desire — it was that I had no safe place to break things. This is the note of closing that gap in an afternoon, and the plan I wrote so the momentum doesn't evaporate.

---

## First, finish what was half-done

The lab box was supposed to be on Debian 13 (trixie). It wasn't — not really. `base-files` reported trixie, but `sources.list` still pointed at bookworm and **401 packages** were stranded at Debian 12 versions. A dist-upgrade had stalled partway and had its sources quietly reverted. A split-brain machine.

The lesson I keep relearning with this box: **verify state from the box, never from memory.** The saved notes said "cleanly on trixie." The live `apt update` output said otherwise.

The fix was a staged, dry-run-first upgrade:

```bash
sudo apt-get -s full-upgrade | grep '^Remv'   # read the removals BEFORE committing
sudo apt-get upgrade --without-new-pkgs
sudo apt-get full-upgrade                       # 1332 upgraded, 405 new, 118 removed
sudo reboot
```

The 118 removals were t64 library renames and expected transitions, not data loss — which is exactly why you read the list before you run it live. After the reboot:

```
$ cat /etc/debian_version
13.6
$ uname -r
6.12.95+deb13-amd64
```

`0 not upgraded` is the number that tells you the job is clean.

## Turning on the hypervisor

The virt stack came across in the upgrade — libvirt 11.3, QEMU 10.0 — it just wasn't switched on. Three small things stood between me and running VMs:

```bash
sudo usermod -aG kvm,libvirt tester        # permission to touch /dev/kvm
sudo systemctl start libvirtd
sudo virsh net-start default && sudo virsh net-autostart default
```

One gotcha cost a few minutes: `virsh net-list` came back empty even though the network clearly existed. The unprivileged `virsh` talks to a *per-user* daemon (`qemu:///session`); the network lives in the *system* one. Point it at the right URI and it's there:

```
$ virsh -c qemu:///system net-list --all
 Name      State    Autostart   Persistent
--------------------------------------------
 default   active   yes         yes
```

## A kernel that boots in a second

Here's the part I actually enjoy. To test a kernel you don't need a full OS install — you need a root filesystem with one program in it. So I built a minimal [BusyBox](https://busybox.net/) initramfs: a ~1.5 MB gzipped cpio archive containing BusyBox, its shared libraries, and an `/init` script that mounts the basics and hands you a shell.

```sh
#!/bin/busybox sh
/bin/busybox --install -s /bin
mount -t proc none /proc
mount -t sysfs none /sys
mount -t devtmpfs none /dev
exec setsid cttyhack sh
```

Pack it, then boot any compiled kernel against it:

```bash
qemu-system-x86_64 -enable-kvm -m 512 -nographic -no-reboot \
  -kernel arch/x86/boot/bzImage -initrd initramfs.cpio.gz \
  -append "console=ttyS0 rdinit=/init"
```

The payoff:

```
[    0.000000] Linux version 6.12.95+deb13-amd64 ...
[    0.000000] Hypervisor detected: KVM
...
=== busybox initramfs up — kernel: 6.12.95+deb13-amd64 ===
~ #
```

From `make` to a shell in about a second, in RAM, with nothing on disk to corrupt. When I break a kernel now, I break it here.

## The harder part: not stopping

Setup is the easy dopamine. The failure mode for a project like this is week three, when novelty runs out. So before touching a single line of kernel code I wrote the plan — twelve weeks, three phases:

1. **Foundations** — shell fluency, C refresh, git and the patch workflow, and building/booting that first kernel.
2. **Internals** — LFD103, writing loadable modules, and reading real subsystem code until it stops looking like hieroglyphics.
3. **Contribution** — find a genuine small fix in `drivers/staging/`, run `checkpatch.pl` until it's silent, and `git send-email` it to the right maintainer.

It leans almost entirely on free material — the Linux Foundation's [LFD103](https://training.linuxfoundation.org/training/a-beginners-guide-to-linux-kernel-development-lfd103/), [KernelNewbies](https://kernelnewbies.org/FirstKernelPatch), [Bootlin's](https://bootlin.com/docs/) slides, LWN, and the kernel's own `Documentation/process/`.

The one design decision I'm proud of is a **recovery rule** baked into the plan itself: *don't restart the clock, resume the checkbox.* Missing days is assumed, not punished. On a low-energy day the bar is one `git pull && make`-sized thing — read a doc section, tick one box. Momentum beats intensity, and a plan that shames you for slipping is a plan you'll abandon.

I built it as an [interactive checklist](https://claude.ai/code/artifact/9402ec45-c74d-4826-860c-deee7f277e24) with timestamped check-ins so there's a dated record of the journey — it exports back to a version-controlled Markdown file whenever I want a permanent copy. If a merged patch is at the end of it, I'll write that note too.
