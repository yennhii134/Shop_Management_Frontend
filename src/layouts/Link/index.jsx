const Link = ({ href, main, children }) => {
    return (
        <a href={href} className={`text-gray-500 ${main && 'font-semibold text-black'}`}>{children}</a>
    )
}
export default Link;