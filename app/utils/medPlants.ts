// utils/medPlants.ts
export const plants = [
  {
    slug: 'kamille',
    title: 'Kamille',
    botanicalTitle: 'Matricaria chamomilla',
    image: 'kamille.jpg',
    type: ['Blüte'],
    effectArea: ['entzündungshemmend', 'krampflösend', 'beruhigend', 'antiseptisch'],
    teaser: "Kamille ist eine zarte, weiß-gelbe Blütenpflanze mit markantem Duft. Sie wächst wild auf Wiesen und ist eine der bekanntesten Heilpflanzen Europas.",
    history: "Kamille wurde bereits im alten Ägypten, im antiken Griechenland und Rom für Heilzwecke genutzt. Sie galt dort als Allheilmittel gegen zahlreiche Leiden und wurde höchst geschätzt. Im Laufe der Jahrhunderte entwickelte sie sich zu einer festen Größe in der europäischen Volksmedizin, insbesondere als sanfte Pflanze für die Behandlung von Entzündungen und Hautleiden. Ihre vielfältigen Anwendungsmöglichkeiten sorgen bis heute für ihren hohen Stellenwert.",
    medApplication: "Kamille eignet sich ideal zur Linderung von Magen-Darm-Beschwerden, wirkt krampflösend und beruhigend. Sie ist entzündungshemmend bei Hautreizungen und Erkrankungen der Schleimhäute. Anwendungen erfolgen als Tee, Inhalation, Bäder oder als Umschlag bei kleinen Verletzungen. Ihre antiseptischen Eigenschaften machen sie zudem zu einem bewährten Hausmittel bei leichten Wunden."
  },
  {
    slug: 'lavendel',
    title: 'Lavendel',
    botanicalTitle: 'Lavandula angustifolia',
    image: 'lavendel.jpg',
    type: ['Blüte'],
    effectArea: ['entspannend', 'antiseptisch', 'stimmungsaufhellend', 'schlaffördernd'],
    teaser: "Lavendel zeigt sich mit violetten Blütenähren und starkem Duft. Er wächst vor allem im Mittelmeerraum und spielt auch in Gärten eine wichtige Rolle.",
    history: "Bereits im antiken Rom und Griechenland wurde Lavendel als Badezusatz und Duftspender geschätzt. Mittelalterliche Klostergärten brachten die Pflanze nach Mitteleuropa, wo sie zur Reinigung, Beruhigung und Desinfektion diente. Bis heute ist Lavendel als Heil- und Duftpflanze beliebt. Besonders wegen seiner entspannenden Wirkung auf Nerven und Psyche findet er breite Anwendung in der Naturheilkunde.",
    medApplication: "Lavendel wird vor allem bei innerer Unruhe, Schlafproblemen und Stresssymptomen eingesetzt. Das ätherische Lavendelöl eignet sich für die Aromatherapie, Massage und als Badezusatz. Auch bei Hautreizungen, leichten Verbrennungen oder Insektenstichen kann Lavendel unterstützend wirken. Tees helfen sanft beim Einschlafen und zur allgemeinen Entspannung."
  },
  {
    slug: 'pfefferminze',
    title: 'Pfefferminze',
    botanicalTitle: 'Mentha × piperita',
    image: 'pfefferminze.jpg',
    type: ['Kraut'],
    effectArea: [
        'appetitanregend',
        'verdauungsfördernd',
        'krampflösend',
        'entzündungshemmend',
        'schmerzlindernd',
        'schleimlösend',
        'erfrischend',
        'durchblutungsfördernd',
        'stressreduzierend',
        'antiseptisch',
        'immunmodulierend'
    ],
    teaser: "Pfefferminze besitzt kräftig-grüne Blätter und einen ausgeprägten, frischen Duft. Sie ist in Europa weit verbreitet und als Würz- und Heilpflanze beliebt.",
    history: "Die Pfefferminze entstand im 17. Jahrhundert als Kreuzung unterschiedlicher Minzarten. Schon bald wurde sie in Europa als Heilmittel gegen Magen-und Darmleiden genutzt. In vielen Kulturen gilt sie traditionell als probates Mittel zur Erfrischung und als Aromageber für Getränke und Speisen. Bis heute ist sie aus der Hausapotheke und Naturheilkunde nicht wegzudenken.",
    medApplication: "Pfefferminze fördert die Verdauung, lindert Krämpfe und hilft bei Kopfschmerzen, Erkältungen oder Übelkeit. Ihr ätherisches Öl hat eine entspannende Wirkung auf die Muskulatur. Als Tee, in Bädern, als Öl oder als Salbe zur äußeren Anwendung ist Pfefferminze vielseitig einsetzbar. Häufig findet sie auch Anwendung bei Konzentrationsstörungen."
  },
  {
    slug: 'salbei',
    title: 'Salbei',
    botanicalTitle: 'Salvia officinalis',
    image: 'salbei.jpg',
    type: ['Kraut'],
    effectArea: ['entzündungshemmend', 'antibakteriell', 'wundheilend', 'schweißhemmend'],
    teaser: "Salbei hat längliche, filzig behaarte aromatische Blätter. Die Pflanze wächst buschig und gedeiht sowohl wild als auch in Gärten.",
    history: "Salbei war bereits den Römern und Griechen als kostbares Heilkraut bekannt. Im Mittelalter wurde er zur „Königin der Heilpflanzen“ ernannt und war ein wichtiger Bestandteil der Klostermedizin. Salbei galt insbesondere als Mittel gegen Halsschmerzen und Entzündungen. In der Volksmedizin wurde er zudem als universelle Arznei und Würzkraut geschätzt.",
    medApplication: "Salbei wird als Tee oder Gurgellösung bei Halsentzündungen und Entzündungen der Mundschleimhaut verwendet. Seine antibakterielle Wirkung macht ihn zu einem bewährten Heilmittel bei Infekten. Außerdem ist Salbei hilfreich bei übermäßigem Schwitzen und kann äußerlich zur Wundheilung sowie als Badezusatz eingesetzt werden."
  },
  {
    slug: 'ringelblume',
    title: 'Ringelblume',
    botanicalTitle: 'Calendula officinalis',
    image: 'ringelblume.jpg',
    type: ['Blüte'],
    effectArea: ['wundheilend', 'entzündungshemmend', 'hautberuhigend'],
    teaser: "Die Ringelblume fällt durch ihre leuchtend orangefarbenen Blüten auf. Sie wächst in Gärten und ist als Nützlingspflanze sehr beliebt.",
    history: "Bereits im Mittelalter wurde die Ringelblume in Klostergärten als Heilpflanze gepflegt. Ihre Blüten galten als Symbol für Hoffnung und Heilung. In der Volksmedizin Europas und Asiens nimmt sie bis heute einen festen Platz ein, besonders wegen ihrer positiven Wirkung auf die Haut und ihrer guten Verträglichkeit selbst bei längerer Anwendung.",
    medApplication: "Ringelblume wird vor allem zur Wundheilung, bei Hautirritationen und Entzündungen eingesetzt. Sie wirkt beruhigend, entzündungshemmend und unterstützt die Regeneration des Gewebes. Präparate wie Salben oder Cremes sind bewährt bei kleinen Verletzungen oder trockener, empfindlicher Haut."
  },
  {
    slug: 'baldrian',
    title: 'Baldrian',
    botanicalTitle: 'Valeriana officinalis',
    image: 'baldrian.jpg',
    type: ['Wurzel'],
    effectArea: ['beruhigend', 'schlaffördernd', 'muskelentspannend'],
    teaser: "Baldrian ist eine hohe, zarte Pflanze mit kleinen, blassrosa Blüten und einer markanten, aromatischen Wurzel.",
    history: "Seit der Antike ist Baldrian für seine entspannende und nervenberuhigende Wirkung bekannt. Im Mittelalter nutzte man ihn besonders bei Schlafstörungen und nervösen Beschwerden. Die Baldrianwurzel fand Eingang in zahlreiche traditionelle Heilmittel Europas und ist mittlerweile auch in der Schulmedizin als pflanzliches Beruhigungsmittel etabliert.",
    medApplication: "Baldrian unterstützt bei Stress, innerer Unruhe und Schlafproblemen. Seine Wurzel wird als Tee, Extrakt oder in Kombinationspräparaten genutzt und hilft, den natürlichen Schlaf zu fördern sowie Muskelverspannungen aufzulösen, ohne dabei abhängig zu machen."
  },
  {
    slug: 'johanniskraut',
    title: 'Johanniskraut',
    botanicalTitle: 'Hypericum perforatum',
    image: 'johanniskraut.jpg',
    type: ['Kraut'],
    effectArea: ['stimmungsaufhellend', 'antidepressiv', 'entzündungshemmend'],
    teaser: "Johanniskraut ist an seinen leuchtend gelben Blüten und durchscheinenden Blättern zu erkennen – es wächst auf Wiesen und an Wegrändern.",
    history: "Johanniskraut wird seit Jahrhunderten traditionell bei Verstimmungen und zur Wundbehandlung eingesetzt. Seine gelben Blüten gelten als „Sonnenfänger“ und Symbol für Licht und Hoffnung. Die Entdeckung der stimmungsaufhellenden Wirkung trug zu seiner heutigen Bedeutung als pflanzliches Antidepressivum maßgeblich bei. In Volksmedizin und Kräuterheilkunde ist Johanniskraut fest verwurzelt.",
    medApplication: "Johanniskraut hilft natürlich bei leichten bis mittleren Depressionen und nervösem Unwohlsein. Es wird als Tee, Öl oder Extrakt angewendet und ist gut verträglich. Darüber hinaus kommen seine entzündungshemmenden Eigenschaften bei Hautproblemen und leichten Verbrennungen äußerlich zum Einsatz."
  },
  {
    slug: 'schafgarbe',
    title: 'Schafgarbe',
    botanicalTitle: 'Achillea millefolium',
    image: 'schafgarbe.jpg',
    type: ['Blüte'],
    effectArea: ['wundheilend', 'blutstillend', 'entzündungshemmend'],
    teaser: "Schafgarbe zeigt sich mit gefiederten Blättern und kleinen, weißen Blüten. Sie wächst auf Wiesen und an Feldrändern und ist bei Insekten beliebt.",
    history: "Schon in der Antike wusste man um die blutstillenden Eigenschaften der Schafgarbe. Sie ist mit alten Heldensagen verbunden und war als Frauen- und Wundkraut aus keiner Hausapotheke wegzudenken. In der europäischen Volksmedizin kommt sie bis heute vielfältig zum Einsatz, insbesondere als wertvolle Heilpflanze bei Verletzungen und Frauenleiden.",
    medApplication: "Die Schafgarbe wird zur Unterstützung der Wundheilung, bei Menstruationsbeschwerden sowie zur Förderung der Verdauung eingesetzt. Sie stoppt kleinere Blutungen, wirkt entzündungshemmend und entkrampfend. Die Anwendung erfolgt meist als Tee, Tinktur oder Aufguss."
  },
  {
    slug: 'thymian',
    title: 'Thymian',
    botanicalTitle: 'Thymus vulgaris',
    image: 'thymian.jpg',
    type: ['Kraut'],
    effectArea: ['antibakteriell', 'hustendämpfend', 'entzündungshemmend'],
    teaser: "Thymian ist ein niedrig wachsendes Kraut mit kleinen, aromatischen Blättern und zarten, rosafarbenen bis lilafarbenen Blüten.",
    history: "Thymian ist eine alte Heilpflanze, die seit Jahrhunderten zur Behandlung von Husten und Atemwegserkrankungen eingesetzt wird. Bereits in der Antike wurde er aufgrund seiner antiseptischen Wirkung hoch geschätzt und fand Verwendung in Klostergärten. Vor allem im Mittelmeerraum ist Thymian ein wichtiger Bestandteil von Küche und Heilkunde.",
    medApplication: "Thymian wird bei Erkältungen, Husten und Bronchitis angewendet. Seine ätherischen Öle helfen beim Abhusten und lindern Entzündungen der Atemwege. Meist als Tee, Sirup oder Inhalation kommt er zur Anwendung. Auch als Würzkraut leistet Thymian gesundheitliche Dienste."
  },
  {
    slug: 'ingwer',
    title: 'Ingwer',
    botanicalTitle: 'Zingiber officinale',
    image: 'ingwer.jpg',
    type: ['Wurzel'],
    effectArea: ['verdauungsfördernd', 'entzündungshemmend', 'antioxidativ'],
    teaser: "Ingwer ist eine tropische Wurzel mit knollenartiger Form und scharf-aromatischem Geschmack. Seine zitronige Schärfe ist charakteristisch.",
    history: "Ingwer wird seit Jahrtausenden vor allem in Asien als Heilmittel bei Verdauungsproblemen, Erkältungen und Entzündungen eingesetzt. Über den Seehandel gelangte er nach Europa, wo er schnell geschätzt wurde. Die vielseitige Wirkung der Ingwerwurzel macht ihn weltweit zu einer der wichtigsten und beliebtesten Gewürz- und Heilpflanzen.",
    medApplication: "Ingwer unterstützt die Verdauung, lindert Übelkeit, wirkt entzündungshemmend und antioxidativ. Er hilft bei Reiseübelkeit, Erkältungen oder Kreislaufproblemen. Frisch, als Tee, Pulver oder Extrakt kommt Ingwer innerlich und äußerlich zum Einsatz."
  }
]
