module.exports = function ({ accepted }) {
    let output = `<div class="cookie">
        <h4 class="cookie__header">Important Cookie Information</h4>
        <div class="cookie__consent">This site uses cookies to give you the best possible experience. By continuing to use the site you agree that we can save cookies on your device. Cookies are small text files placed on your device that remember your preferences and some details of your visit. Our cookies don’t collect personal information. For more information and details of how to disable cookies, please read our updated privacy and cookie policy.</div>
        <form action="/cookie-consent" method="POST"><button>Accept</button></form>
    </div>`

    output = accepted ? '' : output

    return output
}