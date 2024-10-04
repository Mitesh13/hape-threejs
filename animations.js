import { gsap } from "gsap";
let tl;
const animations = (container, containerGroup, camera, model) => {
  const walkHeader1 = document.getElementsByClassName("walk-header-1");
  const walkHeader2 = document.getElementsByClassName("walk-header-2");
  const walkHeaderNumber1 = document.getElementsByClassName(
    "walk-header-number-1"
  );
  const walkHeaderNumber2 = document.getElementsByClassName(
    "walk-header-number-2"
  );
  // Rotating the entire group (model, lights, sparkles)
  gsap.to(containerGroup.rotation, {
    y: Math.PI * 2.1,
    scrollTrigger: {
      trigger: container,
      scrub: 1,
      // pin: true,
      start: () => "top top",
      end: () => "+=800%",
    },
  });

  // Camera z-axis positioning around the model on scroll
  tl = gsap
    .timeline({
      scrollTrigger: {
        trigger: container,
        scrub: 0,
        pin: true,
        start: () => "top top",
        end: () => "+=800%",
        onUpdate: (e) => {
          camera.lookAt(
            model.lookAt[0],
            model.lookAt[1] -
              Math.round((e.progress + Number.EPSILON) * 1000) / 1000,
            model.lookAt[2]
          );
          camera.position.y =
            1.4 - Math.round((e.progress - 0.1 + Number.EPSILON) * 1000) / 1000;
          // console.log("camera.position", camera.position);
        },
      },
    })
    .to(camera.position, {
      z: -1.2,
    })
    .to(camera.position, {
      z: -0.9,
    })
    .to(camera.position, {
      z: -1.5,
    })
    .to(camera.position, {
      z: -2,
    })
    .to(camera.position, {
      z: -2.5,
    })
    .to(camera.position, {
      z: -3.5,
    });
  // .to(containerGroup.position, {
  //   y: 1,
  // });
  const reverseAnim = () => {
    tl.reverse();
  };

  // Walk1 text animation for the number above the text (opacity 0 -> 1)
  gsap.to(walkHeaderNumber1, {
    opacity: 1,
    scrollTrigger: {
      trigger: document.documentElement,
      scrub: 1,
      // scroller: "#container",
      // markers: true,
      // pin: true,
      start: () => "+30% top",
      end: () => "+=50%",
    },
  });

  // Walk1 text animation for the number above the text (opacity 1 -> 0)
  gsap.fromTo(
    walkHeaderNumber1,
    {
      // opacity: 1,
    },
    {
      opacity: 0,
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 1,
        // scroller: "#container",
        // markers: true,
        // pin: true,
        start: () => "+50% top",
        end: () => "+=15%",
      },
    }
  );
  // Walk1 text animation (rotation and opacity 0 -> 1)
  gsap.to(walkHeader1, {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    opacity: 1,
    stagger: 0.05,

    scrollTrigger: {
      trigger: document.documentElement,
      scrub: 1,
      // scroller: "#container",
      // markers: true,
      // pin: true,
      start: () => "+30% top",
      end: () => "+=100%",
    },
  });

  // Walk1 text animation (opacity 1 -> 0)
  gsap.fromTo(
    walkHeader1,
    {
      // opacity: 1,
    },
    {
      top: -50,
      opacity: 0,
      stagger: 0.1,
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 1,
        // scroller: "#container",
        // markers: true,
        // pin: true,
        start: () => "+50% top",
        end: () => "+=80%",
      },
    }
  );

  // Walk2 text animation for the number above the text (opacity 0 -> 1)
  gsap.to(walkHeaderNumber2, {
    opacity: 1,
    scrollTrigger: {
      trigger: document.documentElement,
      scrub: 1,
      // scroller: "#container",
      // markers: true,
      // pin: true,
      start: () => "+60% top",
      end: () => "+=50%",
    },
  });

  // Walk2 text animation (rotation and opacity 0 -> 1)
  const anim = gsap.to(walkHeader2, {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    opacity: 1,
    stagger: 0.05,

    scrollTrigger: {
      trigger: document.documentElement,
      scrub: 1,
      // scroller: "#container",
      // markers: true,
      // pin: true,
      start: () => "+60% top",
      end: () => "+=100%",
    },
  });

  // Walk2 text animation (opacity 1 -> 0)
  gsap.fromTo(
    walkHeader2,
    {
      // opacity: 1,
    },
    {
      top: -50,
      opacity: 0,
      stagger: 0.1,
      // top: walkHeader.getBoundingClientRect().top - 150,
      opacity: 0,
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 1,
        // scroller: "#container",
        // markers: true,
        // pin: true,
        start: () => "+80% top",
        end: () => "+=15%",
      },
    }
  );

  // Walk1 text animation for the number above text (opacity 1 -> 0)
  gsap.fromTo(
    walkHeaderNumber2,
    {
      // opacity: 1,
    },
    {
      opacity: 0,
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 1,
        // scroller: "#container",
        // markers: true,
        // pin: true,
        start: () => "+80% top",
        end: () => "+=15%",
      },
    }
  );
  // tl.reverse(0, false);
  gsap.to("#hidden-scroll", {
    scrollTrigger: {
      trigger: container,
      scrub: 1,
      // pin: true,
      start: () => "top top",
      end: () => "+=700%",
    },
  });
};
export const getReverseAnim = () => {
  let ongoing = null;
  return (camera) => {
    if (ongoing && ongoing.progress() < 1) return ongoing;
    ongoing = gsap.to(camera.rotation, {
      y: camera.rotation.y + 360 * (Math.PI / 180),
      duration: 1,
    });
    ongoing.then((e) => {
      return ongoing;
    });
  };
};

export default animations;
