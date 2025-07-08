// Course data for all courses (future-proofed)
window.COURSES = {
  breakup: {
    id: 'breakup',
    title: 'How to Heal Your Heart in 22 Days',
    weeks: [
      { title: 'Week One: Face Your New Reality', startDay: 1, endDay: 7 },
      { title: 'Week Two: Reclaim Your Power', startDay: 8, endDay: 15 },
      { title: 'Week Three: Rewrite Your Future', startDay: 16, endDay: 22 }
    ],
    introduction: {
      title: 'Introduction: Start Here',
      label: 'HI THERE',
      beforeBegin: `<p>No one signs up for heartbreak. It hits hard, fast, and without warning. One minute you're planning a future, the next, you're grieving what you thought would last.</p>
<p>If you're here, it means something cracked open. And now, you get to decide what comes next.</p>
<p>Right now, it probably feels like your world just fell apart. But what if this moment—the one that feels like the end—is actually the beginning of everything you've been needing?</p>
<p>That's the crazy thing about pain. It doesn't feel like transformation when you're in it — it just feels like chaos. But when we look back, the moments that shaped us were always the darkest ones. They pushed us to change, to shift, to do things we never would've done otherwise.</p>
<p>You might not see it yet. You're in the center of it all, too close to make sense of anything. But one day, you'll look back and realize this wasn't the end of your life. It was the turning point.</p>
<p>You've survived before. You'll do it again. And you'll come out of this stronger, softer, wiser, with a life you couldn't have imagined from here.</p>
<p>Some days will be messy. Some days will feel magical. But by the end, we hope you'll look back and say:<br><strong>That heartbreak didn't break me. It woke me up.</strong></p>
<hr style='border:none;border-top:1px solid #f3eaea;margin:2em 0;'>
<p>We're not going to tell you to just believe in yourself and expect it to magically happen overnight. Healing doesn't work like that. It takes time. This course is here to walk with you, giving you real tools, guidance, and reminders that you're not alone.</p>
<p>If you're walking into this thinking everything is your fault, or that you're broken and need fixing — you're wrong. You're already whole. You're already enough. Healing starts with self-acceptance. From there, you grow. You evolve.</p>
<hr style='border:none;border-top:1px solid #f3eaea;margin:2em 0;'>
<p><strong>Here's something to start doing right away:</strong></p>
<p>When you wake up, don't look at your phone right away.</p>
<p>Instead, stay in silence for at least 10 minutes. Do nothing. Just sit with yourself. Breathe. Just be. That quiet time helps rewire your brain and brings peace before the day begins. If you want, write or think of a few things you're grateful for. Let your morning begin with intention, not distraction.</p>
<hr style='border:none;border-top:1px solid #f3eaea;margin:2em 0;'>
<p>Throughout this course, you'll see daily tasks and suggestions. Try to follow them. These are designed to create real change, and if you stay consistent, they will. But always listen to yourself first. No one can tell you exactly what you need—deep down, only you know that.</p>
<p>That said… be open. Especially to things outside your comfort zone. That's where the shift happens.</p>
<hr style='border:none;border-top:1px solid #f3eaea;margin:2em 0;'>
<p><strong>And here's a little trick that might seem small, but it works:</strong></p>
<p>Change the password on your phone, laptop, or iPad to something empowering — something you want to become or believe, like "i am enough," "i have it all," or "i'm the best." You'll type it every day, and without realizing it, you'll start reprogramming your mind with new beliefs. This tiny shift might feel silly, but it plants a new belief every time you type it. Try it and watch what happens.</p>
<p><strong>Let's begin.</strong></p>`,
      day0: {
        title: 'Day 0: Welcome',
        reading: `<p>If you're here, it probably means you're going through a breakup you didn't fully want.<br>
Maybe they ended it. Maybe it was mutual but still painful. Or maybe you walked away because you had no other choice, even though your heart wasn't ready.</p>
<p>Either way, we're honored to walk this healing journey with you. Over the next 22 days, we'll help you move through the pain, reconnect with yourself, and open your heart again.</p>
<p><strong>Intentions</strong></p>
<p>This course is here to help you:</p>
<ul style="margin-left:1.2em; margin-bottom:1.2em;">
  <li>Find calm and clarity in the chaos</li>
  <li>Ease the anxiety and lift the heaviness</li>
  <li>Shift your mindset and rediscover who you are without them</li>
  <li>Build new habits that support your future</li>
  <li>Use this pain as fuel for transformation</li>
  <li>Open yourself to joy, wholeness, and new love when you're ready</li>
</ul>
<p>What feels like the end right now might be the beginning of everything you've been needing.</p>
<p>It's often in the darkest moments that the best chapters begin, when life pushes us to change, shift, and finally become who we're meant to be.</p>
<p><strong>You're not broken. You're becoming.</strong></p>
<p><strong>How It Works</strong></p>
<p>For the next 22 days, you'll receive a daily reading, a healing task, and a few grounding rituals.<br>
You can do most of it in under 30 minutes or take more time if you need it.</p>
<p>This course is designed to fit into your real life, even when nothing feels normal.<br>
You can make small adjustments if needed, but we recommend sticking with it as closely as you can.<br>
Healing happens when you show up consistently, even on the hard days.</p>
<p>You'll also track your habits to help you stay grounded and accountable.</p>
<p>This isn't a magic fix. Healing is a choice you'll make again and again.<br>
But you won't be doing it alone. Every part of this program is designed to help you feel supported, motivated, and stronger each day.</p>
<p>By the end, we hope this becomes a turning point that helps you remember your power and walk forward as the fullest, freest version of yourself.</p>`,
        task: 'Placeholder for Day 0 task.',
        ritualMorning: 'Placeholder for morning ritual.',
        ritualEvening: 'Placeholder for evening ritual.',
        prompt: 'Placeholder for journaling prompt.',
        audio: null,
      }
    },
    days: [
      // Days 1-22
      ...Array.from({ length: 22 }, (_, i) => ({
        day: i + 1,
        title: `Day ${i + 1}`,
        reading: `Placeholder for Day ${i + 1} reading.`,
        task: `Placeholder for Day ${i + 1} task.`,
        ritualMorning: 'Placeholder for morning ritual.',
        ritualEvening: 'Placeholder for evening ritual.',
        prompt: `Placeholder for Day ${i + 1} journaling prompt.`,
        audio: null,
      }))
    ]
  }
}; 