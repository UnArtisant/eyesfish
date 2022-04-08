export const scaling = (d: number): number => {
    return Math.max( Math.min( -0.2 * Math.pow(d, 2) + 1.05 , 1) , 0 )
}