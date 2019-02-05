interface Guard {
    auth(to, from, next);
    guest(to, from, next);
}
export default Guard;
