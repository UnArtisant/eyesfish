import React, {
    MutableRefObject,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import DockItem from "../../components/dock-item";
import {scaling, between} from "../../helper";
import "./style.css"

function Index() {

    const scaleSize = 0.3

    const CENTER_DIRECTION = "center"
    const LEFT_DIRECTION = "left"
    const RIGHT_DIRECTION = "right"

    //Ref
    const el: MutableRefObject<any> = useRef()

    //State
    const [cursor, setCursor] = useState<number | null>(null)
    const [icons, setIcons] = useState<HTMLElement[]>([])
    const [iconsSize, setIconSize] = useState(64)

    //Methods
    const scaleFromDirection = useCallback((index: number, direction: string, offset: number): number => {
        if (!cursor) return 0
        const center = index + 0.5
        const distanceFromCursor = cursor - center;
        const scale = scaling(distanceFromCursor) * scaleSize
        const icon = icons[index]
        icon.style.setProperty("transform", `translateX(${offset}px) scale(${scale + 1})`)
        icon.style.setProperty("transform-origin", `${direction} bottom`)
        return scale * (iconsSize)
    }, [cursor, icons])

    const scaleIcons = useCallback(() => {
        if (!cursor) return
        const selectedIndex = Math.floor(cursor)
        const centerOffset = cursor - selectedIndex - 0.5
        const baseOffset = scaleFromDirection(selectedIndex, CENTER_DIRECTION, - iconsSize * scaleSize * centerOffset )

        let offset = baseOffset * (0.5 - centerOffset)
        for (let i = selectedIndex + 1; i < icons.length; i++) {
            offset += scaleFromDirection(i, LEFT_DIRECTION, offset)
        }
        offset = baseOffset * (0.5 + centerOffset)
        for (let i = selectedIndex - 1; i >= 0; i--) {
            offset += scaleFromDirection(i, RIGHT_DIRECTION, -offset)
        }
    }, [cursor])

    const handleMouseMove = useCallback((e?: React.MouseEvent<HTMLDivElement>) => {

        if (el.current && e?.clientX) {
            setCursor(between(
                (e?.clientX - el.current.offsetLeft) / iconsSize,
                0,
                icons.length - 1
            ))
        }

    }, [el, icons, iconsSize])


    const handleMouseLeave = useCallback((e) => {
        el.current.classList.add("animated")
        setTimeout(() => {
            setCursor(null)
            icons.forEach(icon => {
                icon.style.removeProperty("transform")
                icon.style.removeProperty("transform-origin")
                el.current.classList.remove("animated")
            })
        }, 100)
    }, [icons])

    const handleMouseEnter = useCallback(() => {
         el.current.classList.add("animated")
        setTimeout(() => {
            el.current.classList.remove("animated")
        }, 100)
    }, [el])

    useEffect(() => {
        const iconsArray: HTMLElement[] = Array.from(el.current.children)
        if (iconsArray.length > 0) {
            setIcons(iconsArray)
            setIconSize(iconsArray[0].offsetWidth)
        }
    }, [el])

    useEffect(() => {
        scaleIcons()
    }, [cursor])

    return (
        <div className="dock-container">
            <div ref={el}
                 onMouseLeave={handleMouseLeave}
                 onMouseEnter={handleMouseEnter}
                 onMouseMove={e => handleMouseMove(e)} className="dock">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <DockItem key={i}>
                        {i}
                    </DockItem>
                ))}
            </div>
        </div>
    );
}

export default Index;