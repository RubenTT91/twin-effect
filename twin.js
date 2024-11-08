let isAnimating = false;
let pullDeltaX = 0; // distancia que la card se esta arrastrando
const DECISION_THRESHOLD = 80;

function startDrag(event){
    if(isAnimating) return;
    // tomamos el elemento más cerca del article
    const actualCard = event.target.closest('article');

    // Tomamos la posición inicial
     const startX = event.pageX ?? event.touches[0].pageX;
     console.log(startX);

     // escuchar el movimiento
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    document.addEventListener('touchmove', onMove, {passive:true});
    document.addEventListener('touchend', onEnd, {passive:true});

    function onMove(event){
        // Encotnrar la posición actual
        const currentX = event.pageX ?? event.touches[0].pageX;
        // Flag indica que estamos animando
        isAnimating = true;
        // distancia recorrida
        pullDeltaX = currentX -  startX;
        // agrego una variable para poner un máximo de rotación
        const deg = pullDeltaX/14;
        //Actualización de el traslado y la rotación del article actualCard, o la de al frente
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
        actualCard.style.cursor='grabbing';

    }

    function onEnd(event){
        //limpio los eventos de escucha
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mousedown', onEnd);
        document.removeEventListener('touchmove', onMove, {passive:true});
        document.removeEventListener('touchend', onMove, {passive:true});

        //Compara la distancia recorrida, con el umbral de decisión que definimos al inicio
        const decisionMade  =Math.abs(pullDeltaX)>= DECISION_THRESHOLD;
        console.log(pullDeltaX);

        if (decisionMade){
         const goRight = pullDeltaX>0;
         const goLeft = !goRight;
         actualCard.classList.add(goRight ? 'to-right':'to-left');
         document.addEventListener('transitionend', ()=>{
             actualCard.remove();
         })
        } else {
            actualCard.classList.add('reset');
            actualCard.classList.remove('to-right', 'to-left');
        }

        // Limpiar variables
        actualCard.addEventListener('transitionend', ()=>{
        actualCard.removeAttribute('style');
        actualCard.classList.remove('reset');
        pullDeltaX = 0;
        isAnimating = false;
        })



        // para eliminar todo

    }
}

document.addEventListener('mousedown', startDrag);
document.addEventListener('touchmove', startDrag, {passive:true})
