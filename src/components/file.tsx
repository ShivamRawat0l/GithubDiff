import { createSignal } from "solid-js";

interface IFile {
    itemName: string;
    content: string;
}

function File(props: IFile) {
    const { itemName, content = '' } = props;
    const [showContent, setShowContent] = createSignal(false);
    return (
        <div>
            <div>{itemName}</div>

            {showContent() && <span
                style={{
                    'white-space': 'pre-line',
                }}
            >{content}</span>}
            <button onClick={() => setShowContent(!showContent())}>Show Content</button>
        </div>
    )
}

export default File;
