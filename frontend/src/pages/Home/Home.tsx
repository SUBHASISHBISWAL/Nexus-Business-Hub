function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row align-items-center min-vh-50">

            {/* Left Content */}
            <div className="col-lg-6">
              <span className="badge bg-white text-dark border mb-3">
                NEXUS ARCHITECTURE 2026
              </span>

              <h1 className="display-4 fw-bold">
                Technology Built for
                <br />
                the Future
              </h1>

              <p className="text-muted mt-3">
                Explore our software, hardware and electronic solutions
                designed for modern businesses. Engineered for
                mission-critical infrastructure.
              </p>

              <div className="mt-4">
                <button className="btn btn-primary me-2">
                  Explore Products →
                </button>

                <button className="btn btn-outline-dark">
                  Contact Sales
                </button>
              </div>

              {/* Statistics */}
              <div className="row mt-5 g-3">
                <div className="col-4">
                  <div className="bg-white border p-3">
                    <small className="text-muted">
                      GLOBAL NODES
                    </small>
                    <h5 className="fw-bold mb-0">
                      14,280+
                    </h5>
                    <small className="text-muted">
                      Active Fabric
                    </small>
                  </div>
                </div>

                <div className="col-4">
                  <div className="bg-white border p-3">
                    <small className="text-muted">
                      MEAN LATENCY
                    </small>
                    <h5 className="fw-bold mb-0">
                      0.42 ms
                    </h5>
                    <small className="text-muted">
                      P99 Guaranteed
                    </small>
                  </div>
                </div>

                <div className="col-4">
                  <div className="bg-white border p-3">
                    <small className="text-muted">
                      MTBF STANDARD
                    </small>
                    <h5 className="fw-bold mb-0">
                      &gt;120k Hrs
                    </h5>
                    <small className="text-muted">
                      Mission Grade
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="col-lg-6 mt-4 mt-lg-0">
              <div className="bg-white border shadow-sm p-4">
                <div className="d-flex justify-content-between mb-3">
                  <small className="fw-bold">
                    ENTERPRISE EXPANSION
                  </small>

                  <small className="text-success">
                    SYSTEM ACTIVE
                  </small>
                </div>

                <div className="bg-light p-5 text-center">
                  <h4 className="fw-bold">
                    Nexus Enterprise Platform
                  </h4>

                  <p className="text-muted mb-0">
                    Mission-critical business infrastructure
                  </p>
                </div>

                <div className="d-flex justify-content-between mt-3">
                  <small className="text-muted">
                    NexusOS v4.19-LTS
                  </small>

                  <small className="text-primary">
                    READY TO DEPLOY
                  </small>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;