import authorizedFetch from "../api/authorizedFetch";

interface githubContent {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string;
    type: string;
}

enum Place {
    left = 1,
    right = -1,
    both = 0
}

enum Type {
    dir = "dir",
    file = "file"
}

class GitDiff {
    static diff: any = {}

    static recursiveDiffChecker = (obj1: githubContent[], obj2: githubContent[], baseUrl1: string, baseUrl2: string, storage: any = this.diff) => {
        if (!obj1 || !obj2) return;
        obj1.forEach(async element => {
            if (element.type === "dir") {
                storage[element.name] = {
                    name: element.name,
                    place: Place.left,
                    type: Type.dir
                }
            }
            else {
                const blob = await authorizedFetch(baseUrl1 + element.path + '/')
                const json = await blob.json();
                const newText = atob(json.content)
                console.log(newText)
                storage[element.name] = {
                    name: element.name,
                    place: Place.left,
                    type: Type.file,
                    content: newText
                }
            }
        });

        obj2.forEach(async element => {
            if (element.type === "dir") {
                if (storage[element.name] === undefined) {
                    storage[element.name] = {
                        name: element.name,
                        place: Place.right,
                        type: Type.dir
                    };
                } else {
                    storage[element.name] = {
                        name: element.name,
                        place: Place.both,
                        type: Type.dir
                    }
                }
            }
            else {
                if (storage[element.name] === undefined) {
                    const blob = await authorizedFetch(baseUrl2 + element.path + '/')
                    const json = await blob.json();
                    const newText = atob(json.content)
                    storage[element.name] = {
                        name: element.name,
                        place: Place.right,
                        type: Type.file,
                        content: newText
                    };
                } else {
                    storage[element.name] = {
                        name: element.name,
                        place: Place.both,
                        type: Type.file
                    }
                }
            }
        })
        this.diff["__INTERNAL_PROGRESS_METER__"] = 1;
    }

    static getDiff = () => {
        return this.diff;
    }

}

export default GitDiff;
export {
    Type
}
