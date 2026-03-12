/**
 * Main landing page displayed after the application starts
 * Serves as a simple welcome screen for users
 */
const MainSite = () => {
    return ( 
        <div className="text-center mt-4">
            <h2>Welcome to ReservedSystem</h2>
            
            {/* Decorative welcome image */}
            <img
                src="/image.png" 
                alt="Welcome"
                className="img-fluid rounded shadow"
                style={{ maxWidth: "400px"}}
            />
        </div>
    )
}

export default MainSite;