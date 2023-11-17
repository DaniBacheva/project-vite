import { usePlaceContext } from "../../contexts/PlaceContext";

import Place from "./Place/Place";


export default function Dashboard() {
    const { places } = usePlaceContext();

    return (
        <>
            <h2>PLACES TO VISIT</h2>
            <section id="dashboard">


                {places.map(p =>
                    <Place {...p} key={p._id} />)}

                {places.length === 0 &&
                    <h2>No Places yet.</h2>}

            </section>
        </>

    )
}