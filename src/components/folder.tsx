import { type Component } from "solid-js";

const Folder = (props: { itemName: string }) => {
    const { itemName } = props;
    return (
        <div>
            <h1>{itemName}</h1>
        </div>
    )
}
export default Folder;

