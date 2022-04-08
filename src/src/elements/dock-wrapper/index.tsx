import React, {MutableRefObject, useCallback, useEffect, useRef, useState} from 'react';
import DockItem from "../../components/dock-item";
import {scaling, between} from "../../helper";
import "./style.css"

function Index() {

    //Ref
    const el: MutableRefObject<any> = useRef()

    //State
    const [cursor, setCursor] = useState<number | null>(null)
    const [icons, setIcons] = useState<HTMLElement[]>([])
    const [iconsSize, setIconSize] = useState(64)

    //Methods

    const scaleIcons = useCallback(() => {
        if (!cursor) return
        icons.forEach((icon, k) => {
            const center = k + 0.5
            const distanceFromCursor = cursor - center;
            const scale = scaling(distanceFromCursor)
            icon.style.setProperty("transform", `scale(${scale + 1})`)
        })
    }, [cursor])

    const handleMouseMove = useCallback((e?: React.MouseEvent<HTMLDivElement>) => {

        if (el.current && e?.clientX) {
            setCursor(between(
                (e?.clientX - el.current.offsetLeft) / iconsSize,
                0,
                icons.length
            ))
        }

    }, [el, icons, iconsSize])

    const handleMouseLeave = useCallback((e) => {
        console.log(e)
        setCursor(null)
        icons.forEach(icon => {
            icon.style.setProperty("transform", `scale(1)`)
        })
    }, [icons])

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