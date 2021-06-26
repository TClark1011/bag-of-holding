# Roadmap

This roadmap outlines the plan for new features and updates to Bag of Holding.

## Ongoing Efforts

As well working towards the milestones outlined below, there will also be consistent ongoing efforts to improve Bag of Holding in the following areas:

- **Testing:** Automated testing procedures will be implemented and improved upon
- **Bug Fixes:** As bugs are brought to our attention, we will do our best to fix them
- **Quality of Life:** Small improvements will be made to application to make it as seamless and intuitive to use as possible

---

## Version 1.1: Tidying Up

The 1.1 update will focus on "cleaning up" certain of aspects of Bag of Holding. This will primarily involve the addition of extra pages on the website to provide more information to users and some quality of life improvements to the way in which inventory sheets function.

- [ ] **New Pages:** "Information" and "Contact" pages on the Bag of Holding website
- [ ] **Will & Testimony:** When deleting a party member from a sheet, the user will be given a prompt to decide whether items carried by that character should now be carried by nobody, if they should be deleted, or if they should all be moved to another party member.
- [ ] **Are You Sure?** Confirmation prompts before party members or items are deleted
- [ ] **Housekeeping:** Inventory sheets will be automatically deleted if they are left inactive for a long time. (Don't be worried about your sheets being deleted, as long as a sheet is used with almost any degree of regularity it will not be deleted)

<!-- If implementing PWA features turns out to be relatively easy, it can go here or in 1.2 -->

## Version 1.2: Convenience

Version 1.2 will add 2 new features, one larger than the other, both focusing on making inventory management with Bag of Holding more seamless and convenient.

- [ ] **Premade Items:** Items from from the System Reference Documents of various popular tabletop RPGs (including Dungeons and Dragons 5th edition)
- [ ] **Recent Sheets:** Bag of Holding will recognize returning users, storing information about the sheet they access and showing them a list of recently accessed whenever they return to the home page.
- [ ] **Tags:** "category" field will be replaced with "tags" which will essentially function identically to categories, with the key difference being that multiple tags can be assigned to a single item
- [ ] **UI History Control:** Dialog prompts will be able to be closed using the browser's history navigation buttons

## Version 1.3: Individualism

This update will focus on additional functionality for individual party members

- [ ] **Carry Weight:** can enter how much weight a party member is able to carry and will be alerted if they are carrying more weight than they can handle
- [ ] **Character Ownership:** Whenever a user accesses a sheet, they will be prompted to select which party member they play as, giving them special access and control over the character they play. Users can also select a "GM" option in the prompt, giving them full control over all party members, or alternatively they can select "Spectator" to access the sheet without selecting a character.
- [ ] **Currency:** well as the standard inventory, each party member will be able to track their own currency
- [ ] **Hidden Items:** The owner of a character can mark certain inventory items as hidden, meaning that only users who have indicated ownership of that character can see them.

---

## Tentatively Looking Forward

Currently, we only have solid milestones laid out for the next 3 updates. There are ideas for what could come next depending on how things play out. These include:

- **Real Time Data Sync:** Migrate from a REST API to MongoDB Realm for real time sheet updates
- **Accounts:** Users can optionally create an account with Bag of Holding, allowing sheets to be saved directly to there account
- **Custom Premade Items:** Some way to allow users to add their own lists of premade items to be quickly added to inventory sheets 
