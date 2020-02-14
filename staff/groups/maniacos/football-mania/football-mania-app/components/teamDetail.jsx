function TeamDetail({ detail, goToResults }) {
    const {
        strAlternate,
        strStadiumThumb,
        strDescriptionEN,
        strWebsite,
        strTeamBadge,
        strTeamJersey,
        strTeamLogo,
        strTeamFanart1,
        strTeamFanart2,
        strTeamFanart3,
        strTeamFanart4,
        strTeamBanner,
    } = detail
    const headerStyle = {
        backgroundImage: `url(${strStadiumThumb})`
    }

    return <section>
        <a href="" onClick={(event) => {
            event.preventDefault()
            goToResults()
        }}>Go back to Results</a><br /><br /><br />

        <section className="teamDetail">
            <div className="teamDetail__header" style={headerStyle}>
                <span className="teamDetail__title">
                    <a href={`//${strWebsite}`} target="_blank">{strAlternate}</a>
                </span>
            </div>
            <div className="teamDetail__description">{strDescriptionEN}</div>

            <h3 className="light--big-text text-center">Jersey & Logo</h3><hr className="faded-sides" />

            <div className="teamDetail__galleries">
                <article className="teamDetail__gallery">
                    <a href={strTeamJersey} target="_blank"><div className="teamDetail__media" style={{ backgroundImage: `url(${strTeamJersey})` }}></div></a>
                </article>
                <article className="teamDetail__gallery">
                    <a href={strTeamBadge} target="_blank"><div className="teamDetail__media" style={{ backgroundImage: `url(${strTeamBadge})` }}></div></a>
                </article>
                <article className="teamDetail__gallery">
                    <a href={strTeamLogo} target="_blank"><div className="teamDetail__media" style={{ backgroundImage: `url(${strTeamLogo})` }}></div></a>
                </article>
            </div>
            
            <h3 className="light--big-text text-center">Fan Arts</h3><hr className="faded-sides"/>

            <div className="teamDetail__galleries">
                <article className="teamDetail__gallery">
                    <a href={strTeamFanart1} target="_blank"><div className="teamDetail__media teamDetail__media-bg" style={{backgroundImage: `url(${strTeamFanart1})`}}></div></a>
                </article>
                <article className="teamDetail__gallery">
                    <a href={strTeamFanart2} target="_blank"><div className="teamDetail__media teamDetail__media-bg" style={{backgroundImage: `url(${strTeamFanart2})`}}></div></a>
                </article>
                <article className="teamDetail__gallery">
                    <a href={strTeamFanart3} target="_blank"><div className="teamDetail__media teamDetail__media-bg" style={{backgroundImage: `url(${strTeamFanart3})`}}></div></a>
                </article>
                <article className="teamDetail__gallery">
                    <a href={strTeamFanart4} target="_blank"><div className="teamDetail__media teamDetail__media-bg" style={{backgroundImage: `url(${strTeamFanart4})`}}></div></a>
                </article>
                <article className="teamDetail__gallery">
                    <a href={strTeamBanner} target="_blank"><div className="teamDetail__media teamDetail__media-bg" style={{backgroundImage: `url(${strTeamBanner})`}}></div></a>
                </article>
            </div>
        </section>
    </section>
}