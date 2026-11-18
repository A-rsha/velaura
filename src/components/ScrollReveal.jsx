import React, { useEffect, useRef, useState } from 'react'

function ScrollReveal({
    children,
    direction = 'up',
    delay = 2,
    duration = 800,
    once = false,
    className = ''
}) {

    const elementRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {

        const element = elementRef.current

        if (!element) return

        // Reduced motion accessibility
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches

        if (prefersReducedMotion) {
            setIsVisible(true)
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {

                if (entry.isIntersecting) {

                    setIsVisible(true)

                    if (once) {
                        observer.unobserve(element)
                    }

                } else if (!once) {

                    setIsVisible(false)

                }

            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            }
        )

        observer.observe(element)

        return () => {
            observer.disconnect()
        }

    }, [once])

    const directions = {

        up: 'translateY(45px)',
        down: 'translateY(-45px)',
        left: 'translateX(-45px)',
        right: 'translateX(45px)',
        zoom: 'scale(0.88)',
        fade: 'none'

    }

    const hiddenTransform = directions[direction] || directions.up

    return (

        <div
            ref={elementRef}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translate(0) scale(1)' : hiddenTransform,
                transition: `opacity ${duration}ms ease, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                transitionDelay: `${delay}ms`,
                willChange: isVisible ? 'auto' : 'opacity, transform'
            }}
        >

            {children}

        </div>

    )
}

export default ScrollReveal