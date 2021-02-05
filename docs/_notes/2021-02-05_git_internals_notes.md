# git internals

great references:
- http://gitlet.maryrosecook.com/docs/gitlet.html
- http://www.kernel.org/pub/software/scm/git/docs/technical/racy-git.txt
- https://mirrors.edge.kernel.org/pub/software/scm/git/docs/technical/directory-rename-detection.txt- https://mirrors.edge.kernel.org/pub/software/scm/git/docs/technical/commit-graph.txt

---

# https://stackoverflow.com/a/4086986:
> The index is a binary file (generally kept in .git/index) containing a sorted list of path names, each with permissions and the SHA1 of a blob object; git ls-files can show you the contents of the index: (http://shafiulazam.com/gitbook/7_the_git_index.html)

  $ git ls-files --stage
  100644 63c918c667fa005ff12ad89437f2fdc80926e21c 0   .gitignore
  100644 5529b198e8d14decbe4ad99db3f7fb632de0439d 0   .mailmap

> The index is one of the most important data structures in git.
> It represents a virtual working tree state by recording list of paths and their object names and serves as a staging area to write out the next tree object to be committed.
> The state is "virtual" in the sense that it does not necessarily have to, and often does not, match the files in the working tree.
- http://www.kernel.org/pub/software/scm/git/docs/technical/racy-git.txt

> To see more, cf. "git/git/Documentation/technical/index-format.txt":



# https://stackoverflow.com/a/25806452
## Bit by bit analysis

I've decided to do a little testing to better understand the format and research some of the fields in more detail.

Results bellow are the same for Git versions `1.8.5.2` and `2.3`.

I have marked points which I'm not sure / haven't found with `TODO`: please feel free to complement those points.

As others mentioned, the index is stored under `.git/index`, not as a standard tree object, and its format is binary and documented at: <https://github.com/git/git/blob/master/Documentation/technical/index-format.txt>

The major structs that define the index are at [cache.h](https://github.com/git/git/blob/f3f407747c1cce420ae4b4857c4a6806efe38680/cache.h), because the index is a cache for creating commits.

## Setup

When we start a test repository with:

    git init
    echo a > b
    git add b
    tree --charset=ascii

The `.git` directory looks like:

    .git/objects/
    |-- 78
    |   `-- 981922613b2afb6025042ff6bd878ac1994e85
    |-- info
    `-- pack

And if we get the content of the only object:

    git cat-file -p 78981922613b2afb6025042ff6bd878ac1994e85

We get `a`. This indicates that:

- the `index` points to the file contents, since `git add b` created a blob object
- it stores the metadata in the index file, not in a tree object, since there was only a single object: the blob (on regular Git objects, blob metadata is stored on the tree)

## hd analysis

Now let's look at the index itself:

    hd .git/index

Gives:

    00000000  44 49 52 43 00 00 00 02  00 00 00 01 54 09 76 e6  |DIRC.... ....T.v.|
    00000010  1d 81 6f c6 54 09 76 e6  1d 81 6f c6 00 00 08 05  |..o.T.v. ..o.....|
    00000020  00 e4 2e 76 00 00 81 a4  00 00 03 e8 00 00 03 e8  |...v.... ........|
    00000030  00 00 00 02 78 98 19 22  61 3b 2a fb 60 25 04 2f  |....x.." a;*.`%./|
    00000040  f6 bd 87 8a c1 99 4e 85  00 01 62 00 ee 33 c0 3a  |......N. ..b..3.:|
    00000050  be 41 4b 1f d7 1d 33 a9  da d4 93 9a 09 ab 49 94  |.AK...3. ......I.|
    00000060

Next we will conclude:

      | 0           | 4            | 8           | C              |
      |-------------|--------------|-------------|----------------|
    0 | DIRC        | Version      | File count  | ctime       ...| 0
      | ...         | mtime                      | device         |
    2 | inode       | mode         | UID         | GID            | 2
      | File size   | Entry SHA-1                              ...|
    4 | ...                        | Flags       | Index SHA-1 ...| 4
      | ...                                                       |

First comes the header, defined at: [struct cache_header](https://github.com/git/git/blob/f3f407747c1cce420ae4b4857c4a6806efe38680/cache.h#L113):

- `44 49 52 43`: `DIRC`. TODO: why is this necessary?

- `00 00 00 02`: format version: 2. The index format has evolved with time. Currently there exists version up to 4. The format of the index should not be an issue when collaborating between different computers on GitHub because bare repositories don't store the index: it is generated at clone time.

- `00 00 00 01`: count of files on the index: just one, `b`.

Next starts a list of index entries, defined by [struct cache_entry](https://github.com/git/git/blob/f3f407747c1cce420ae4b4857c4a6806efe38680/cache.h#L142) Here we have just one. It contains:

-   a bunch of file metadata: 8 byte `ctime`, 8 byte `mtime`, then 4 byte: device, inode, mode, UID and GID.

    Note how:

    -   `ctime` and `mtime` are the same (`54 09 76 e6 1d 81 6f c6`) as expected since we haven't modified the file

        The first bytes are seconds since EPOCH in hex:

            date --date="@$(printf "%x" "540976e6")"

        Gives:

            Fri Sep  5 10:40:06 CEST 2014

        Which is when I made this example.

        The second 4 bytes are nanoseconds.

    -   UID and GID are `00 00 03 e8`, 1000 in hex: a common value for single user setups.

    All of this metadata, most of which is not present in tree objects, allows Git to check if a file has changed quickly without comparing the entire contents.

-   at the beginning of line `30`: `00 00 00 02`: file size: 2 bytes (`a` and `\n` from `echo`)

-   `78 98 19 22 ... c1 99 4e 85`: 20 byte SHA-1 over the previous content of the entry. Note that according to [my experiments with the assume valid flag](https://stackoverflow.com/a/28657085/895245), the flags that follow it are not considered in this SHA-1.

-   2 byte flags: `00 01`

    -   1 bit: assume valid flag. My investigations indicate that this poorly named flag is where `git update-index --assume-unchanged` stores its state: <https://stackoverflow.com/a/28657085/895245>

    -   1 bit extended flag. Determines if the extended flags are present or not.
        Must be `0` on version 2 which does not have extended flags.

    -   2 bit stage flag used during merge. Stages are documented in `man git-merge`:

        - `0`: regular file, not in a merge conflict
        - `1`: base
        - `2`: ours
        - `3`: theirs

        During a merge conflict, all stages from 1-3 are stored in the index
        to allow operations like `git checkout --ours`.

        If you `git add`, then a stage 0 is added to the index for the path,
        and Git will know that the conflict has been marked as solved. TODO: check this.

    -   12 bit length of the path that will follow: `0 01`: 1 byte only since the path was `b`

-   2 byte extended flags. Only meaningful if the "extended flag" was set on the basic flags. TODO.

-   `62` (ASCII `b`): variable length path. Length determined in the previous flags, here just 1 byte, `b`.

Then comes a `00`: 1-8 bytes of zero padding so that the path will be null-terminated and the index will end in a multiple of 8 bytes. This only happens before index version 4.

No extensions were used. Git knows this because there would not be enough space left in the file for the checksum.

Finally there is a 20 byte checksum `ee 33 c0 3a .. 09 ab 49 94` over the content of the index.

---

# racy-git 
https://mirrors.edge.kernel.org/pub/software/scm/git/docs/technical/racy-git.txt

Use of index and Racy Git problem
=================================

Background
----------

The index is one of the most important data structures in Git.
It represents a virtual working tree state by recording list of
paths and their object names and serves as a staging area to
write out the next tree object to be committed.  The state is
"virtual" in the sense that it does not necessarily have to, and
often does not, match the files in the working tree.

There are cases Git needs to examine the differences between the
virtual working tree state in the index and the files in the
working tree.  The most obvious case is when the user asks `git
diff` (or its low level implementation, `git diff-files`) or
`git-ls-files --modified`.  In addition, Git internally checks
if the files in the working tree are different from what are
recorded in the index to avoid stomping on local changes in them
during patch application, switching branches, and merging.

In order to speed up this comparison between the files in the
working tree and the index entries, the index entries record the
information obtained from the filesystem via `lstat(2)` system
call when they were last updated.  When checking if they differ,
Git first runs `lstat(2)` on the files and compares the result
with this information (this is what was originally done by the
`ce_match_stat()` function, but the current code does it in
`ce_match_stat_basic()` function).  If some of these "cached
stat information" fields do not match, Git can tell that the
files are modified without even looking at their contents.

Note: not all members in `struct stat` obtained via `lstat(2)`
are used for this comparison.  For example, `st_atime` obviously
is not useful.  Currently, Git compares the file type (regular
files vs symbolic links) and executable bits (only for regular
files) from `st_mode` member, `st_mtime` and `st_ctime`
timestamps, `st_uid`, `st_gid`, `st_ino`, and `st_size` members.
With a `USE_STDEV` compile-time option, `st_dev` is also
compared, but this is not enabled by default because this member
is not stable on network filesystems.  With `USE_NSEC`
compile-time option, `st_mtim.tv_nsec` and `st_ctim.tv_nsec`
members are also compared. On Linux, this is not enabled by default
because in-core timestamps can have finer granularity than
on-disk timestamps, resulting in meaningless changes when an
inode is evicted from the inode cache.  See commit 8ce13b0
of git://git.kernel.org/pub/scm/linux/kernel/git/tglx/history.git
([PATCH] Sync in core time granularity with filesystems,
2005-01-04). This patch is included in kernel 2.6.11 and newer, but
only fixes the issue for file systems with exactly 1 ns or 1 s
resolution. Other file systems are still broken in current Linux
kernels (e.g. CEPH, CIFS, NTFS, UDF), see
https://lore.kernel.org/lkml/5577240D.7020309@gmail.com/

Racy Git
--------

There is one slight problem with the optimization based on the
cached stat information.  Consider this sequence:

  : modify 'foo'
  $ git update-index 'foo'
  : modify 'foo' again, in-place, without changing its size

The first `update-index` computes the object name of the
contents of file `foo` and updates the index entry for `foo`
along with the `struct stat` information.  If the modification
that follows it happens very fast so that the file's `st_mtime`
timestamp does not change, after this sequence, the cached stat
information the index entry records still exactly match what you
would see in the filesystem, even though the file `foo` is now
different.
This way, Git can incorrectly think files in the working tree
are unmodified even though they actually are.  This is called
the "racy Git" problem (discovered by Pasky), and the entries
that appear clean when they may not be because of this problem
are called "racily clean".

To avoid this problem, Git does two things:

. When the cached stat information says the file has not been
  modified, and the `st_mtime` is the same as (or newer than)
  the timestamp of the index file itself (which is the time `git
  update-index foo` finished running in the above example), it
  also compares the contents with the object registered in the
  index entry to make sure they match.

. When the index file is updated that contains racily clean
  entries, cached `st_size` information is truncated to zero
  before writing a new version of the index file.

Because the index file itself is written after collecting all
the stat information from updated paths, `st_mtime` timestamp of
it is usually the same as or newer than any of the paths the
index contains.  And no matter how quick the modification that
follows `git update-index foo` finishes, the resulting
`st_mtime` timestamp on `foo` cannot get a value earlier
than the index file.  Therefore, index entries that can be
racily clean are limited to the ones that have the same
timestamp as the index file itself.

The callers that want to check if an index entry matches the
corresponding file in the working tree continue to call
`ce_match_stat()`, but with this change, `ce_match_stat()` uses
`ce_modified_check_fs()` to see if racily clean ones are
actually clean after comparing the cached stat information using
`ce_match_stat_basic()`.

The problem the latter solves is this sequence:

  $ git update-index 'foo'
  : modify 'foo' in-place without changing its size
  : wait for enough time
  $ git update-index 'bar'

Without the latter, the timestamp of the index file gets a newer
value, and falsely clean entry `foo` would not be caught by the
timestamp comparison check done with the former logic anymore.
The latter makes sure that the cached stat information for `foo`
would never match with the file in the working tree, so later
checks by `ce_match_stat_basic()` would report that the index entry
does not match the file and Git does not have to fall back on more
expensive `ce_modified_check_fs()`.


Runtime penalty
---------------

The runtime penalty of falling back to `ce_modified_check_fs()`
from `ce_match_stat()` can be very expensive when there are many
racily clean entries.  An obvious way to artificially create
this situation is to give the same timestamp to all the files in
the working tree in a large project, run `git update-index` on
them, and give the same timestamp to the index file:

  $ date >.datestamp
  $ git ls-files | xargs touch -r .datestamp
  $ git ls-files | git update-index --stdin
  $ touch -r .datestamp .git/index

This will make all index entries racily clean.  The linux project, for
example, there are over 20,000 files in the working tree.  On my
Athlon 64 X2 3800+, after the above:

  $ /usr/bin/time git diff-files
  1.68user 0.54system 0:02.22elapsed 100%CPU (0avgtext+0avgdata 0maxresident)k
  0inputs+0outputs (0major+67111minor)pagefaults 0swaps
  $ git update-index MAINTAINERS
  $ /usr/bin/time git diff-files
  0.02user 0.12system 0:00.14elapsed 100%CPU (0avgtext+0avgdata 0maxresident)k
  0inputs+0outputs (0major+935minor)pagefaults 0swaps

Running `git update-index` in the middle checked the racily
clean entries, and left the cached `st_mtime` for all the paths
intact because they were actually clean (so this step took about
the same amount of time as the first `git diff-files`).  After
that, they are not racily clean anymore but are truly clean, so
the second invocation of `git diff-files` fully took advantage
of the cached stat information.


Avoiding runtime penalty
------------------------

In order to avoid the above runtime penalty, post 1.4.2 Git used
to have a code that made sure the index file
got timestamp newer than the youngest files in the index when
there are many young files with the same timestamp as the
resulting index file would otherwise would have by waiting
before finishing writing the index file out.

I suspected that in practice the situation where many paths in the
index are all racily clean was quite rare.  The only code paths
that can record recent timestamp for large number of paths are:

. Initial `git add .` of a large project.

. `git checkout` of a large project from an empty index into an
  unpopulated working tree.

Note: switching branches with `git checkout` keeps the cached
stat information of existing working tree files that are the
same between the current branch and the new branch, which are
all older than the resulting index file, and they will not
become racily clean.  Only the files that are actually checked
out can become racily clean.

In a large project where raciness avoidance cost really matters,
however, the initial computation of all object names in the
index takes more than one second, and the index file is written
out after all that happens.  Therefore the timestamp of the
index file will be more than one seconds later than the
youngest file in the working tree.  This means that in these
cases there actually will not be any racily clean entry in
the resulting index.

Based on this discussion, the current code does not use the
"workaround" to avoid the runtime penalty that does not exist in
practice anymore.  This was done with commit 0fc82cff on Aug 15,
2006.


---

# interesting commands
```
torchy:~/d/d/1/g/gitlet-package on master
$ git ls-tree HEAD                                                                                                                                       [129] ✘
100644 blob ffd2b7d6ae657a56cb77975c9ec1afecafa907e6    .gitignore
100644 blob a795a5c964d0af66dc013ae467662c25715db664    LICENSE.md
100644 blob f5fcf8d8a23f9bd30b7f10a7f26aca72545c8c52    README.md
040000 tree 5908c857f6cd39cfc8cb6fa1ca9cffc45d7086b4    docs
100755 blob 46564c6f076d7b5ab6c0013ce19bd81ea10037af    gitlet.js
100644 blob 13a29d568be9f17a98feda9955a8248a89300a59    index.html
100644 blob af5a9fca54c46a5abed07b4e86719f02f892aa44    package.json
040000 tree e9b6c99f79ff5ab9953d3d668ca5c3b77c424828    resources
040000 tree e9efeee39c190b8329d1a3737d1106a4e99f31bb    spec
 
torchy:~/d/d/1/g/gitlet-package on master
$ git ls-files --stage
100644 ffd2b7d6ae657a56cb77975c9ec1afecafa907e6 0       .gitignore
100644 a795a5c964d0af66dc013ae467662c25715db664 0       LICENSE.md
100644 f5fcf8d8a23f9bd30b7f10a7f26aca72545c8c52 0       README.md
100644 a2899ac87854d0fc8e2367a234fec490908bd769 0       docs/docco.css
100644 a74f38fe8f22116da30a8bde3c6638de64129f3a 0       docs/gitlet.html
100644 1b32532a8e40e483069482c3650c3ef22ef16bdd 0       docs/public/fonts/aller-bold.eot
100644 dc4cc9c27a59ab14fbb7444c6ab35c5b33a034f6 0       docs/public/fonts/aller-bold.ttf
100644 fa16fd0aba81582de121d833c7bc50e8f1b1b981 0       docs/public/fonts/aller-bold.woff
100644 40bd654b5fe63501ae64d5673b5aa45051a69e65 0       docs/public/fonts/aller-light.eot
100644 c2c72902a1b6ecb6e22376256a3ece17dd100a30 0       docs/public/fonts/aller-light.ttf
100644 81a09d18ecdfdc5be11d55912268014b4d2d4d9f 0       docs/public/fonts/aller-light.woff
100644 98a9a7fbabb1083aca5143bc306e228886ff2eeb 0       docs/public/fonts/novecento-bold.eot
100644 2af39b08b07df11423ac44c1fb2ff0ca82e81346 0       docs/public/fonts/novecento-bold.ttf
100644 de558b5a29bcb4445be8ffd739c929bf4d3730af 0       docs/public/fonts/novecento-bold.woff
100644 73abb76fa418d070053579755fd19a1c022f7ad7 0       docs/public/stylesheets/normalize.css
100755 46564c6f076d7b5ab6c0013ce19bd81ea10037af 0       gitlet.js
100644 13a29d568be9f17a98feda9955a8248a89300a59 0       index.html
100644 af5a9fca54c46a5abed07b4e86719f02f892aa44 0       package.json
100644 e23850545b8cd2f3c22233c65177633ee99efe6b 0       resources/main.css
100644 d244adeeb23f556cf578e1eec6fe734359a37132 0       spec/add.spec.js
100644 0bf6409a8715e2d3e3bcb69f69d4022005da97dd 0       spec/branch.spec.js
100644 a48b344722536634bed03dc18ef6595d013beee3 0       spec/checkout.spec.js
100644 1f318ab477a7209d11ed1ba41d63b4e1f178a777 0       spec/clone.spec.js
100644 48398fcdd4a558a468adb772154f7209aae21a5f 0       spec/command-line.spec.js
100644 e4e0e03254407d132560a7dc810ce703572d1a69 0       spec/commit.spec.js
100644 87080bc49fd1f16f6704d68c206e32a9e1e4e504 0       spec/diff.spec.js
100644 0b8b39144dd4c02108cd9bdcd3a1a4bd0ad0712b 0       spec/fetch.spec.js
100644 f4c55e463c27e78d4215867dda7d172a97d69322 0       spec/init.spec.js
100644 15401806ab7c7c3600910bc1aa105e678231492c 0       spec/merge.spec.js
100644 f0fcf6ba6de1db807842e953e8df2fde853ff799 0       spec/pull.spec.js
100644 e9747ecc8a7ffdbfe258a3966dae125b0abb2b9e 0       spec/push.spec.js
100644 03e4d233359239ce5d9ae5276c4f24c7173623f5 0       spec/remote.spec.js
100644 f785e1bd161f2a476e3587f29011e5c7b8f1494b 0       spec/rm.spec.js
100644 1c867f736f089ef1cd64039530a4a807764012ea 0       spec/status.spec.js
100644 431a978a4a7b3c0a92a7c8d7aa2d56b474f65b0f 0       spec/test-util.js
100644 17cacbb82d62ebb5d4bf2bbb7d72bc5507b75815 0       spec/update-index.spec.js
100644 2e81e966300f0f89d9c42d2cc1e275286e37127b 0       spec/update-ref.spec.js
100644 11c072db96f14858e28f666daa57149b68be566e 0       spec/write-tree.spec.js
 
 
torchy:~/d/d/1/g/gitlet-package on master
$ git ls-tree --full-tree -r HEAD
100644 blob ffd2b7d6ae657a56cb77975c9ec1afecafa907e6    .gitignore
100644 blob a795a5c964d0af66dc013ae467662c25715db664    LICENSE.md
100644 blob f5fcf8d8a23f9bd30b7f10a7f26aca72545c8c52    README.md
100644 blob a2899ac87854d0fc8e2367a234fec490908bd769    docs/docco.css
100644 blob a74f38fe8f22116da30a8bde3c6638de64129f3a    docs/gitlet.html
100644 blob 1b32532a8e40e483069482c3650c3ef22ef16bdd    docs/public/fonts/aller-bold.eot
100644 blob dc4cc9c27a59ab14fbb7444c6ab35c5b33a034f6    docs/public/fonts/aller-bold.ttf
100644 blob fa16fd0aba81582de121d833c7bc50e8f1b1b981    docs/public/fonts/aller-bold.woff
100644 blob 40bd654b5fe63501ae64d5673b5aa45051a69e65    docs/public/fonts/aller-light.eot
100644 blob c2c72902a1b6ecb6e22376256a3ece17dd100a30    docs/public/fonts/aller-light.ttf
100644 blob 81a09d18ecdfdc5be11d55912268014b4d2d4d9f    docs/public/fonts/aller-light.woff
100644 blob 98a9a7fbabb1083aca5143bc306e228886ff2eeb    docs/public/fonts/novecento-bold.eot
100644 blob 2af39b08b07df11423ac44c1fb2ff0ca82e81346    docs/public/fonts/novecento-bold.ttf
100644 blob de558b5a29bcb4445be8ffd739c929bf4d3730af    docs/public/fonts/novecento-bold.woff
100644 blob 73abb76fa418d070053579755fd19a1c022f7ad7    docs/public/stylesheets/normalize.css
100755 blob 46564c6f076d7b5ab6c0013ce19bd81ea10037af    gitlet.js
100644 blob 13a29d568be9f17a98feda9955a8248a89300a59    index.html
100644 blob af5a9fca54c46a5abed07b4e86719f02f892aa44    package.json
100644 blob e23850545b8cd2f3c22233c65177633ee99efe6b    resources/main.css
100644 blob d244adeeb23f556cf578e1eec6fe734359a37132    spec/add.spec.js
100644 blob 0bf6409a8715e2d3e3bcb69f69d4022005da97dd    spec/branch.spec.js
100644 blob a48b344722536634bed03dc18ef6595d013beee3    spec/checkout.spec.js
100644 blob 1f318ab477a7209d11ed1ba41d63b4e1f178a777    spec/clone.spec.js
100644 blob 48398fcdd4a558a468adb772154f7209aae21a5f    spec/command-line.spec.js
100644 blob e4e0e03254407d132560a7dc810ce703572d1a69    spec/commit.spec.js
100644 blob 87080bc49fd1f16f6704d68c206e32a9e1e4e504    spec/diff.spec.js
100644 blob 0b8b39144dd4c02108cd9bdcd3a1a4bd0ad0712b    spec/fetch.spec.js
100644 blob f4c55e463c27e78d4215867dda7d172a97d69322    spec/init.spec.js
100644 blob 15401806ab7c7c3600910bc1aa105e678231492c    spec/merge.spec.js
100644 blob f0fcf6ba6de1db807842e953e8df2fde853ff799    spec/pull.spec.js
100644 blob e9747ecc8a7ffdbfe258a3966dae125b0abb2b9e    spec/push.spec.js
100644 blob 03e4d233359239ce5d9ae5276c4f24c7173623f5    spec/remote.spec.js
100644 blob f785e1bd161f2a476e3587f29011e5c7b8f1494b    spec/rm.spec.js
100644 blob 1c867f736f089ef1cd64039530a4a807764012ea    spec/status.spec.js
100644 blob 431a978a4a7b3c0a92a7c8d7aa2d56b474f65b0f    spec/test-util.js
100644 blob 17cacbb82d62ebb5d4bf2bbb7d72bc5507b75815    spec/update-index.spec.js
100644 blob 2e81e966300f0f89d9c42d2cc1e275286e37127b    spec/update-ref.spec.js
100644 blob 11c072db96f14858e28f666daa57149b68be566e    spec/write-tree.spec.js

```

```
$ npx github-files-fetcher --url='https://github.com/git/git/tree/master/Documentation/technical' --out='git-tech-docs'

fetcher |████████████████████████████████████████| 100% || 33/33 File(s) || downloaded || authenticated: false
 
torchy:~/d/d/1/gitlet
$ l
.
├── a/
├── b/
├── git-tech-docs/
├── gitlet-package/
├── node_modules/
├── package-lock.json
└── package.json

5 directories, 2 files
```