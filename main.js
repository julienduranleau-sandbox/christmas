const BG_COLOR = 0xFF99A1
const FLAKE_COLOR = 0xFFFFFF

const peach = document.querySelector("#peach")

const canvas = document.createElement("canvas")
canvas.width = 480
canvas.height = 1080 / 1920 * canvas.width
document.body.style.margin = "0px"
document.body.style.overflow = "hidden"

canvas.style.width = "100%"
canvas.style.imageRendering = "crisp-edges"
canvas.style.imageRendering = "pixelated"

document.body.append(canvas)

const ctx = canvas.getContext("2d")

const flakes = []

for (let i = 0; i < 500; i++) {
    update(0)
}

tick(0)

function tick(t) {
    update(t)
    draw()
    requestAnimationFrame(tick)
}

function create_snowflake() {
    flakes.push({
        x: Math.random() * (canvas.width * 2) - canvas.width,
        y: -1 + Math.random() * -10,
        vx: 0.2,
        vy: 1,
        distance: Math.random(),
        rotation: 0,
        speed: 1.5,
    })

    flakes.sort((a, b) => {
        return a.distance - b.distance
    })
}

function update(t) {
    for (let i = 0; i < 3; i++) {
        create_snowflake()
    }

    for (let i = flakes.length - 1; i >= 0; i--) {
        const flake = flakes[i]
        const screen_speed = ((1 - flake.distance) + 0.5) * flake.speed
        flake.x += flake.vx * screen_speed
        flake.y += flake.vy * screen_speed

        if (flake.y > canvas.height + 10) {
            flakes.splice(i, 1)
        }
    }
}

function draw() {
    ctx.fillStyle = "#" + BG_COLOR.toString(16)
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = flakes.length - 1; i >= 0; i--) {
        const flake = flakes[i]
        ctx.fillStyle = color_lerp(Math.min(1.0, 1.3 - flake.distance), BG_COLOR, FLAKE_COLOR)
        const size = Math.ceil((1 - flake.distance) * 3)

        if (window.location.hash == "#peach") {
            ctx.drawImage(peach, flake.x, flake.y, 10, 10)
        } else {
            ctx.fillRect(flake.x - size, flake.y, size, size)
            ctx.fillRect(flake.x + size, flake.y, size, size)
            ctx.fillRect(flake.x, flake.y - size, size, size)
            ctx.fillRect(flake.x, flake.y + size, size, size)
        }
    }
}

function color_lerp(ratio, c1, c2) {
    const r_low = Math.min(c1 >> 16, c2 >> 16)
    const r_high = Math.max(c1 >> 16, c2 >> 16)
    const r = r_low + (r_high - r_low) * ratio
    // console.log(r_low.toString(16), r_high.toString(16), r.toString(16))

    const g_low = Math.min((c1 >> 8) & 0xFF, (c2 >> 8) & 0xFF)
    const g_high = Math.max((c1 >> 8) & 0xFF, (c2 >> 8) & 0xFF)
    const g = g_low + (g_high - g_low) * ratio
    // console.log(g_low.toString(16), g_high.toString(16), g.toString(16))

    const b_low = Math.min(c1 & 0xFF, c2 & 0xFF)
    const b_high = Math.max(c1 & 0xFF, c2 & 0xFF)
    const b = b_low + (b_high - b_low) * ratio
    // console.log(b_low.toString(16), b_high.toString(16), b.toString(16))

    const lerped_c = Math.floor((r << 16) + (g << 8) + b)

    return "#" + lerped_c.toString(16)
}
