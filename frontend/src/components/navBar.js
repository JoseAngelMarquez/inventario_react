import React from "react";

const NavBar = () => {
    return (
        <div style={styles.navBar}>
            <h2 style={{ color: "#fff" }}>NavBar</h2>
        </div>
    );
};

const styles = {
    navBar: {
        backgroundColor: "#333",
        padding: "15px",
        height: "50px",
        width: "100%", // aquí estaba el error, antes tenías "with"
        display: "flex",
        alignItems: "center"
    },
};

export default NavBar;
