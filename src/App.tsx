import { createResource, type Component, Show, createEffect, createMemo, For, onCleanup, createSignal } from 'solid-js';
import differenceChecker, { Type } from './github/diffchecker';
import GitDiff from './github/diffchecker';
import Folder from './components/folder';
import File from './components/file';
import authorizedFetch from './api/authorizedFetch';

async function fetchGithubContents(url: string) {
    const blob = await authorizedFetch(url)
    const json = blob.json();
    return json;
}

const App: Component = () => {
    const url1 = 'https://api.github.com/repos/ShivamRawat0l/PMPExam/contents/'
    const url2 = 'https://api.github.com/repos/thecodingmachine/react-native-boilerplate/contents/'

    const [url1Data] = createResource(url1, fetchGithubContents)
    const [url2Data] = createResource(url2, fetchGithubContents)

    createEffect(() => {
        GitDiff.recursiveDiffChecker(url1Data(), url2Data(), url1, url2)
    })

    const [rootFolder, setRootFolder] = createSignal()

    const interval = setInterval(() => {
        setRootFolder(GitDiff.getDiff())
        clearInterval(interval)
    }, 1000)
    onCleanup(() => {
        clearInterval(interval)
    })

    return (
        <div>
            <h1>Git Online Diff!</h1>
            <input type="text" placeholder="Enter a git repo URL" />
            <input type="text" placeholder="Enter a git repo URL" />
            <Show
                when={rootFolder() != undefined}
                fallback={<div>Loading...</div>}
            >
                <h1>Difference </h1>
                <div style={{
                    'display': 'flex',
                    'flex-direction': 'row',
                }}>
                    <div

                        style={{
                            'display': 'flex',
                            'flex-direction': 'column',
                        }}
                    >
                        <For
                            each={Object.keys(rootFolder())}>
                            {(item) => (
                                rootFolder()[item].type === Type.dir ?
                                    <Folder itemName={rootFolder()[item].name} /> :
                                    <File itemName={rootFolder()[item].name} content={rootFolder()[item].content} />
                            )}
                        </For>
                    </div>
                    <div>----------</div>
                    <div

                        style={{
                            'display': 'flex',
                            'flex-direction': 'column',
                        }}
                    >
                        <For each={Object.keys(rootFolder())}>{(item, i) =>
                            <div>{item}</div>
                        }
                        </For>
                    </div>
                </div>
            </Show>
        </div>
    );
};


export default App;
