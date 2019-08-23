import {move} from '../../effect';
import {NavButton} from './NavButton';

export function NavBar(menu) {
    const it = menu.getChildByName('nav');

    const background = Background(it.getChildByName('background'));

    const buttons =
        it.children
            .filter(({name}) => ['back', 'exchange', 'setting', 'information', 'home'].includes(name))
            .map(NavButton);

    buttons.forEach((btn) => {
        btn.alpha = 0;
        btn.interactive = false;
    });

    const [
        backButton,
        exchangeButton,
        settingButton,
        infoButton,
        homeButton,
    ] = buttons;

    backButton.on('click', () => menu.close());

    exchangeButton.on('click', () => menu.open('exchange'));

    async function open() {
        await background.open();

        await Promise.all(
            buttons.map((btn) => btn.open())
        );
    }

    async function close() {
        await Promise.all(
            buttons.map((btn) => btn.close())
        );

        await background.close();
    }

    function Background(it) {
        const config = {
            targets: it,
            duration: 500,
            easing: 'easeInOutExpo',
        };

        async function moveTo(options) {
            await move({
                ...(config),
                ...(options),
            }).finished;
        }

        const width = it.width;

        async function open() {
            if (it.interactive) return;

            it.interactive = true;
            await moveTo({x: `-= ${width}`});
        }

        async function close() {
            if (!it.interactive) return;

            await moveTo({x: `+= ${width}`});
            it.interactive = false;
        }

        return Object.assign(it, {open, close});
    }

    return Object.assign(it, {open, close});
}