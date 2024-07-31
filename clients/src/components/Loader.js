import React from "react";
import { useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";

function Loader() {
    let [loading, setLoading] = useState(true);
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <div className="sweet-loading">
                <PuffLoader
                    color={'#000'}
                    loading={loading}
                    cssOverride={{}}
                    size={80}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        </div>
    )
}

export default Loader;