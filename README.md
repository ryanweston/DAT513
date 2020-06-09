# Mappa.Ply

GPS map based application based on pyscho-geographical principles.

**What do you do?** The application, based around the city of Plymouth, UK, walks the user through stages, requiring them to enter a highlighted zone at each stage. When entering the zone, the map will disappear and ambient music, relevant to the historical culture of the given area, will be begin to play. The music will get louder the closer you get to the zone's historical landmark, encouraging exploration. When you reach a certain distance from the landmark you will be given a riddle in which you have to solve to locate the landmark, and move to the next stage.

Project site: <https://projects.ryanweston.me/Mappa.Ply/>

**Want to see more of the project?** Mappa.Ply currently reads data manually inputted into a JSON file, meaning the application will only work in Plymouth. If you want to see it in action, I have a rough trailer that's currently a little too embarassing to put out in public. However, I'm happy to share the link with anyone who's interested.


**Inspiration:** The work is heavily inspired by Ian Sinclair's commentary on Susan Phillipz's Tate exhibit. His commentary here helps to encapsulate the atmosphere we attempted to recreate within the project.

<p align="center">
<a href="https://youtu.be/ISzXgoE7Dc0" target="_blank"><img src="http://img.youtube.com/vi/ISzXgoE7Dc0/0.jpg" 
alt="IMAGE ALT TEXT HERE" width="480" height="360" border="10" /></a>
</p>

**Disclaimer:** Project was developed as part of a 3 week intensive group based module. There are a lot of features and UI elements  that need to be ironed out + added but time constraints didn't allow for too much perfection. Brief also required use of P5.js. While it was a group based module, I took the lead of the whole development process, as well as the design of the UI/UX, minus the branding.


Cross-browser support.  Best functionality is found in Firefox & Chrome.

### Technologies
----

- P5.js
	- Mappa (allows map rendering in p5.js)
- Leaflet
- Turf.js


### Roadmap
----
The project has a cool concept that I believe can translate well into a public  application. With pyschogeography picking up more recognition in academia, there are a ton of features I'd like to add.

- 🤖 Explore options to automate polygons & riddles to be able to add more cities.
- 🗺 Consider moving to mapbox from leaflet for better documentation. Also move away from P5.js.
- 🎨 Improve the overall UI/UX of the application, adding an intro instruction page.
- 📱 Work on zone sizing tweaking to encourage more exploration time.
- ⏳ Add a loading screen.

### Instructions
----

1. The location rationale for the project is located at the barbican, Plymouth. To test in person head to that area, indicated by the zone on the map.

2. Recommended to use headphones, head to the target zone shown as a polygon.

3. Ambient sound plays when you’re within the zone and you hit “Start Journey”, getting louder the closer you get to the target riddle area. 

4. When standing next to the resolution to the riddle, the historical landmark, a completion screen will show. When complete button is pressed, you gain a score and the next zone appears. Repeat. 
